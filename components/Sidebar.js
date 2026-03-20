"use client";

import { CATEGORIES, DIFFICULTIES, TYPES, DIFFICULTY_COLORS, TYPE_COLORS } from "@/lib/constants";
import ProgressBar from "./ProgressBar";

export default function Sidebar({
  questions,
  filters,
  onFilterChange,
  selectedId,
  onSelectQuestion,
  completedIds,
  filteredQuestions,
}) {
  const toggleFilter = (group, value) => {
    const current = filters[group];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [group]: next });
  };

  const overallDone = questions.filter((q) => completedIds.includes(q.id)).length;

  return (
    <aside className="w-80 min-w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <a href="/" className="text-lg font-bold text-white hover:text-blue-400 transition-colors">
          AI Engineer Practice
        </a>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-4 border-b border-neutral-800 overflow-y-auto">
        {/* Type Filter */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Type</h3>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => {
              const active = filters.types.includes(t.value);
              const colors = TYPE_COLORS[t.value];
              return (
                <button
                  key={t.value}
                  onClick={() => toggleFilter("types", t.value)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    active
                      ? `${colors.bg} ${colors.text} ${colors.border}`
                      : "border-neutral-700 text-neutral-500 hover:border-neutral-500"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Difficulty</h3>
          <div className="flex flex-wrap gap-1.5">
            {DIFFICULTIES.map((d) => {
              const active = filters.difficulties.includes(d.value);
              const colors = DIFFICULTY_COLORS[d.value];
              return (
                <button
                  key={d.value}
                  onClick={() => toggleFilter("difficulties", d.value)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    active
                      ? `${colors.bg} ${colors.text} ${colors.border}`
                      : "border-neutral-700 text-neutral-500 hover:border-neutral-500"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Category</h3>
          <div className="space-y-1">
            {CATEGORIES.map((c) => {
              const active = filters.categories.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  onClick={() => toggleFilter("categories", c.slug)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition-all ${
                    active
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <p className="text-xs text-neutral-500 px-2 py-1">{filteredQuestions.length} questions</p>
          {filteredQuestions.map((q) => {
            const isActive = q.id === selectedId;
            const isDone = completedIds.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => onSelectQuestion(q.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isDone ? "bg-emerald-500" : "bg-neutral-700"}`} />
                  <span className="truncate">{q.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 border-t border-neutral-800">
        <ProgressBar done={overallDone} total={questions.length} />
      </div>
    </aside>
  );
}
