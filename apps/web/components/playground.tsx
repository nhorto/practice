"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Monaco } from "@monaco-editor/react";
import type { editor as monacoEditor } from "monaco-editor";
import { drills, type DrillId } from "@/lib/drills";

// Monaco is served from public/vs (synced from node_modules by
// scripts/sync-monaco.mjs) rather than a CDN, so the playground works offline
// and the runtime always matches the `monaco-editor` types we compile against.
// Monaco's workers are loaded by the worker itself, which can't resolve a
// root-relative path — so bootstrap each one from a data: URL that points at
// an absolute origin. This is Monaco's documented self-hosting shim.
const configureMonacoWorkers = (): void => {
    // baseUrl is the PARENT of /vs — Monaco appends the "vs/..." prefix itself.
  const origin = window.location.origin;

  window.MonacoEnvironment = {
    // The AMD (`min/vs`) build ships one universal worker entry point;
    // workerMain.js loads the right language worker from the baseUrl itself.
    getWorkerUrl: () => {
      const bootstrap = [
        `self.MonacoEnvironment = { baseUrl: "${origin}/" };`,
        `importScripts("${origin}/vs/base/worker/workerMain.js");`,
      ].join("\n");
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(bootstrap)}`;
    },
  };
};

const Editor = dynamic(
  async () => {
    const mod = await import("@monaco-editor/react");
    configureMonacoWorkers();
    mod.loader.config({ paths: { vs: "/vs" } });
    return mod.default;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        Loading editor…
      </div>
    ),
  },
);

type LogLevel = "log" | "info" | "warn" | "error";

type LogEntry = {
  id: number;
  level: LogLevel;
  text: string;
};

type RunState =
  | { status: "idle" }
  | { status: "running"; runId: number; srcdoc: string }
  | { status: "done"; runId: number; srcdoc: string };

type RunnerMessage = {
  source: "ts-dojo-runner";
  runId: number;
  level: LogLevel | "done";
  text: string;
};

const isLogLevel = (value: string): value is LogLevel =>
  value === "log" || value === "info" || value === "warn" || value === "error";

const isRunnerMessage = (data: unknown): data is RunnerMessage => {
  if (typeof data !== "object" || data === null) return false;
  return (
    "source" in data &&
    data.source === "ts-dojo-runner" &&
    "runId" in data &&
    typeof data.runId === "number" &&
    "level" in data &&
    typeof data.level === "string" &&
    (isLogLevel(data.level) || data.level === "done") &&
    "text" in data &&
    typeof data.text === "string"
  );
};

const buildSrcdoc = (js: string, runId: number): string => {
  const safeJs = js.replace(/<\/script/gi, "<\\/script");
  return `<!doctype html><html><head><meta charset="utf-8"></head><body><script>
(() => {
  const send = (level, parts) => {
    const text = parts
      .map((part) => {
        if (typeof part === "string") return part;
        try {
          return JSON.stringify(part, null, 1);
        } catch {
          return String(part);
        }
      })
      .join(" ");
    parent.postMessage({ source: "ts-dojo-runner", runId: ${runId}, level, text }, "*");
  };
  for (const level of ["log", "info", "warn", "error"]) {
    const original = console[level].bind(console);
    console[level] = (...args) => {
      send(level, args);
      original(...args);
    };
  }
  window.addEventListener("error", (event) => send("error", [event.message]));
  window.addEventListener("unhandledrejection", (event) =>
    send("error", ["Unhandled rejection: " + String(event.reason)]),
  );
  try {
    ${safeJs}
  } catch (err) {
    send("error", [String(err)]);
  }
  send("done", [""]);
})();
</script></body></html>`;
};

const severityLabel: Readonly<Record<number, string>> = {
  8: "error",
  4: "warning",
  2: "info",
  1: "hint",
};

const defaultDrill = drills[0];

export function Playground() {
  const [selectedId, setSelectedId] = useState<DrillId>(defaultDrill.id);
  const [code, setCode] = useState<string>(defaultDrill.starterCode);
  const [showHint, setShowHint] = useState(false);
  const [markers, setMarkers] = useState<readonly monacoEditor.IMarker[]>([]);
  const [logs, setLogs] = useState<readonly LogEntry[]>([]);
  const [run, setRun] = useState<RunState>({ status: "idle" });

  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const runIdRef = useRef(0);
  const logIdRef = useRef(0);

  const selectedDrill = drills.find((drill) => drill.id === selectedId) ?? defaultDrill;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data: unknown = event.data;
      if (!isRunnerMessage(data) || data.runId !== runIdRef.current) return;
      if (data.level === "done") {
        setRun((previous) =>
          previous.status === "running" && previous.runId === data.runId
            ? { ...previous, status: "done" }
            : previous,
        );
        return;
      }
      const level = data.level;
      setLogs((previous) => [
        ...previous,
        { id: ++logIdRef.current, level, text: data.text },
      ]);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const handleBeforeMount = (monaco: Monaco) => {
    monacoRef.current = monaco;

    monaco.editor.defineTheme("dojo-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#09090b",
        "editorGutter.background": "#09090b",
        "minimap.background": "#09090b",
      },
    });

    const ts = monaco.languages.typescript;
    ts.typescriptDefaults.setCompilerOptions({
      strict: true,
      noUncheckedIndexedAccess: true,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      lib: ["es2020", "dom"],
      allowNonTsExtensions: true,
    });
    ts.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  };

  const handleMount = (editor: monacoEditor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const selectDrill = (id: DrillId) => {
    const drill = drills.find((candidate) => candidate.id === id);
    if (!drill) return;
    setSelectedId(id);
    setCode(drill.starterCode);
    setShowHint(false);
    setLogs([]);
    setMarkers([]);
    setRun({ status: "idle" });
  };

  const handleRun = async () => {
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    if (!monaco || !model) return;

    const runId = ++runIdRef.current;
    setLogs([]);

    try {
      const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
      const worker = await getWorker(model.uri);
      const output = await worker.getEmitOutput(model.uri.toString());
      const js = output.outputFiles[0]?.text;
      if (js === undefined) {
        setLogs([
          {
            id: ++logIdRef.current,
            level: "error",
            text: "TypeScript worker produced no output.",
          },
        ]);
        return;
      }
      setRun({ status: "running", runId, srcdoc: buildSrcdoc(js, runId) });
    } catch (error) {
      setLogs([
        {
          id: ++logIdRef.current,
          level: "error",
          text: error instanceof Error ? error.message : String(error),
        },
      ]);
    }
  };

  const errorCount = markers.filter((marker) => marker.severity === 8).length;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden">
      {/* Drill sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-r border-zinc-800 md:flex">
        <p className="px-4 pt-4 pb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Quick drills
        </p>
        <ul className="pb-4">
          {drills.map((drill) => {
            const active = drill.id === selectedId;
            return (
              <li key={drill.id}>
                <button
                  type="button"
                  onClick={() => selectDrill(drill.id)}
                  className={`w-full px-4 py-2.5 text-left transition-colors ${
                    active ? "bg-zinc-900" : "hover:bg-zinc-900/50"
                  }`}
                >
                  <span
                    className={`block text-sm ${
                      active ? "font-medium text-sky-400" : "text-zinc-200"
                    }`}
                  >
                    {drill.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {drill.topic} · week {drill.weekRef}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Editor + output */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-2">
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-100">
              {selectedDrill.title}
            </span>
            <span className="block truncate text-xs text-zinc-500">
              {selectedDrill.topic} · week {selectedDrill.weekRef} · self-check: make the
              errors disappear
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowHint((previous) => !previous)}
            className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          <button
            type="button"
            onClick={() => selectDrill(selectedId)}
            className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleRun}
            className="rounded-md bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-500"
          >
            Run ▸
          </button>
        </div>

        {showHint ? (
          <div className="border-b border-zinc-800 bg-sky-950/30 px-4 py-2.5 text-xs leading-relaxed text-sky-200">
            <span className="mr-2 font-semibold uppercase tracking-wider text-sky-400">
              Hint
            </span>
            <code className="font-mono">{selectedDrill.hint}</code>
          </div>
        ) : null}

        <div className="min-h-0 flex-1">
          <Editor
            language="typescript"
            theme="dojo-dark"
            path="file:///drill.ts"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            beforeMount={handleBeforeMount}
            onMount={handleMount}
            onValidate={(nextMarkers) => setMarkers(nextMarkers)}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
              scrollBeyondLastLine: false,
              tabSize: 2,
              padding: { top: 12 },
              automaticLayout: true,
              renderLineHighlight: "none",
            }}
          />
        </div>

        {/* Output panel */}
        <div className="grid h-48 shrink-0 grid-cols-2 divide-x divide-zinc-800 border-t border-zinc-800">
          <section className="flex min-w-0 flex-col">
            <h2 className="flex items-center gap-2 px-4 pt-2.5 pb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Problems
              <span
                className={`rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums ${
                  errorCount > 0
                    ? "bg-red-500/15 text-red-400"
                    : "bg-emerald-500/15 text-emerald-400"
                }`}
              >
                {errorCount}
              </span>
            </h2>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 font-mono text-xs leading-relaxed">
              {markers.length === 0 ? (
                <p className="text-emerald-400/80">No type errors — types are green.</p>
              ) : (
                <ul className="space-y-1">
                  {markers.map((marker, index) => (
                    <li
                      key={`${marker.startLineNumber}:${marker.startColumn}:${index}`}
                      className={marker.severity === 8 ? "text-red-400" : "text-amber-400"}
                    >
                      <span className="text-zinc-500">
                        {marker.startLineNumber}:{marker.startColumn}
                      </span>{" "}
                      <span className="text-zinc-600">
                        [{severityLabel[marker.severity] ?? "info"}]
                      </span>{" "}
                      {marker.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="flex min-w-0 flex-col">
            <h2 className="px-4 pt-2.5 pb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Console
            </h2>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 font-mono text-xs leading-relaxed">
              {logs.length === 0 ? (
                <p className="text-zinc-600">
                  {run.status === "idle"
                    ? "Press Run to execute the emitted JavaScript."
                    : run.status === "running"
                      ? "Running…"
                      : "Run finished — no output."}
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {logs.map((entry) => (
                    <li
                      key={entry.id}
                      className={
                        entry.level === "error"
                          ? "text-red-400"
                          : entry.level === "warn"
                            ? "text-amber-400"
                            : "text-zinc-300"
                      }
                    >
                      <span className="select-none text-zinc-600">
                        {entry.level === "error" ? "✗ " : entry.level === "warn" ? "! " : "› "}
                      </span>
                      <span className="whitespace-pre-wrap">{entry.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Sandboxed runner */}
      {run.status !== "idle" ? (
        <iframe
          key={run.runId}
          title="playground-runner"
          sandbox="allow-scripts"
          srcDoc={run.srcdoc}
          className="hidden"
        />
      ) : null}
    </div>
  );
}
