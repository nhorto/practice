"use client";

import { useEffect, useState } from "react";
import {
  curriculum,
  exerciseCommand,
  isDaySlug,
  totalSessions,
  type DaySlug,
  type WeekId,
} from "@/lib/curriculum";

const STORAGE_KEY = "ts-dojo:progress:v1";

type Progress = ReadonlySet<DaySlug>;

const readProgress = (): Progress => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter(isDaySlug));
  } catch {
    return new Set();
  }
};

const writeProgress = (progress: Progress) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...progress]));
  } catch {
    // storage unavailable (private mode, quota) — progress stays in memory
  }
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy “${text}”`}
      className="shrink-0 rounded border border-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        className="h-full rounded-full bg-sky-500 transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Dashboard() {
  const [done, setDone] = useState<Progress>(new Set());
  const [open, setOpen] = useState<ReadonlySet<WeekId>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const progress = readProgress();
    setDone(progress);
    const firstIncomplete = curriculum.find((week) =>
      week.days.some((day) => !progress.has(day.slug)),
    );
    setOpen(new Set(firstIncomplete ? [firstIncomplete.id] : []));
    setLoaded(true);
  }, []);

  const toggleDay = (slug: DaySlug) => {
    setDone((previous) => {
      const next = new Set(previous);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      writeProgress(next);
      return next;
    });
  };

  const toggleWeek = (id: WeekId) => {
    setOpen((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            8-Week Curriculum
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Write TypeScript like a TypeScript dev — 5 sessions a week, hands on the
            keyboard.
          </p>
        </div>
        <div className="min-w-56">
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Overall
            </span>
            <span className="text-sm font-semibold tabular-nums text-zinc-200">
              {done.size}/{totalSessions} sessions
            </span>
          </div>
          <ProgressBar value={done.size} max={totalSessions} />
        </div>
      </div>

      <div className="space-y-4">
        {curriculum.map((week) => {
          const doneInWeek = week.days.filter((day) => done.has(day.slug)).length;
          const isOpen = open.has(week.id);
          return (
            <section
              key={week.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/40"
            >
              <button
                type="button"
                onClick={() => toggleWeek(week.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span className="font-mono text-xs font-semibold text-sky-400">
                  W{week.code}
                </span>
                <span className="flex-1 text-sm font-medium text-zinc-100">
                  {week.title}
                </span>
                <span className="hidden text-xs tabular-nums text-zinc-500 sm:block">
                  {doneInWeek}/{week.days.length}
                </span>
                <span className="w-24 shrink-0">
                  <ProgressBar value={doneInWeek} max={week.days.length} />
                </span>
                <span
                  aria-hidden
                  className={`text-zinc-600 transition-transform ${isOpen ? "rotate-90" : ""}`}
                >
                  ›
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-zinc-800/80 px-5 pb-4">
                  <ul className="divide-y divide-zinc-800/60">
                    {week.days.map((day) => {
                      const checked = done.has(day.slug);
                      const command = exerciseCommand(day.slug);
                      return (
                        <li key={day.slug} className="flex items-center gap-3 py-2.5">
                          <input
                            id={`day-${day.slug}`}
                            type="checkbox"
                            checked={checked}
                            disabled={!loaded}
                            onChange={() => toggleDay(day.slug)}
                            className="size-4 shrink-0 accent-sky-500"
                          />
                          <label
                            htmlFor={`day-${day.slug}`}
                            className="flex-1 cursor-pointer text-sm"
                          >
                            <span
                              className={
                                checked
                                  ? "text-zinc-500 line-through decoration-zinc-600"
                                  : "text-zinc-200"
                              }
                            >
                              <span className="mr-2 font-mono text-xs text-zinc-500">
                                d{day.day}
                              </span>
                              {day.title}
                            </span>
                            <span className="ml-2 text-xs text-zinc-500">
                              {day.reading}
                            </span>
                          </label>
                          <code className="hidden rounded bg-zinc-800/70 px-2 py-0.5 font-mono text-xs text-zinc-400 md:block">
                            {command}
                          </code>
                          <CopyButton text={command} />
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-2 border-t border-zinc-800/60 pt-3 text-xs text-zinc-400">
                    <span className="font-medium uppercase tracking-wider text-zinc-500">
                      Project
                    </span>
                    <span className="text-zinc-300">{week.project.name}</span>
                    <code className="font-mono text-zinc-500">{week.project.path}</code>
                    <span className="text-zinc-600">· {week.project.note}</span>
                  </p>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
