/**
 * Domain types for the task tracker.
 *
 * Style rules on display here:
 * - No enums: an `as const` array + indexed access gives us both the runtime
 *   list AND the union type, from one source of truth.
 * - `type`, not `interface` (nothing extends anything).
 */

export const TASK_STATUSES = ["todo", "done"] as const;

/** "todo" | "done" — derived, never hand-written. */
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  /** ISO 8601 timestamp, e.g. new Date().toISOString() */
  createdAt: string;
  /** Set when status becomes "done". */
  completedAt?: string;
};
