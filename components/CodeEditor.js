"use client";

export default function CodeEditor({ value, onChange, readOnly = false, className = "" }) {
  return (
    <textarea
      className={`code-editor w-full bg-neutral-950 text-emerald-300 font-mono text-sm p-4 rounded-lg border border-neutral-700 resize-y min-h-[200px] ${
        readOnly ? "opacity-80 cursor-default" : ""
      } ${className}`}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
    />
  );
}
