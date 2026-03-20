"use client";

import { DIFFICULTY_COLORS } from "@/lib/constants";

export default function DifficultyBadge({ difficulty }) {
  const colors = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.core;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}
