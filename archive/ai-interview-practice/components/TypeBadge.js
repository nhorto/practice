"use client";

import { TYPE_COLORS } from "@/lib/constants";

export default function TypeBadge({ type }) {
  const colors = TYPE_COLORS[type] || TYPE_COLORS.coding;
  const label = type === "open-ended" ? "Open-Ended" : type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {label}
    </span>
  );
}
