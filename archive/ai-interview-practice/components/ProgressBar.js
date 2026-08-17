"use client";

export default function ProgressBar({ done, total, className = "" }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>{done}/{total} completed</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
