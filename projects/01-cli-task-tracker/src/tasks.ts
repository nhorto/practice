/**
 * Pure task operations — milestones 1 and 4.
 *
 * No I/O in this file, ever: these functions take tasks in and return new
 * tasks out. That's what makes them trivially testable.
 */
import type { Task, TaskStatus } from "./types";

/**
 * Milestone 1 — create a new task from a title.
 * Returns a NEW array (never mutate the input); the new task gets the next
 * free id (max existing id + 1, or 1 for an empty list).
 */
export const addTask = (tasks: readonly Task[], title: string): Task[] => {
  throw new Error("TODO: milestone 1");
};

/**
 * Milestone 1 — mark the task with `id` as done (sets completedAt).
 * Unknown ids leave the list unchanged. No mutation.
 */
export const completeTask = (tasks: readonly Task[], id: number): Task[] => {
  throw new Error("TODO: milestone 1");
};

/** Milestone 1 — only the tasks with the given status. */
export const filterByStatus = (
  tasks: readonly Task[],
  status: TaskStatus,
): Task[] => {
  throw new Error("TODO: milestone 1");
};

/**
 * Milestone 4 — sorting with a DERIVED key type.
 *
 * TODO milestone 4: replace this placeholder with a type derived from Task
 * (the guide walks through `as const satisfies` + indexed access) so the
 * compiler — not you — keeps SortKey in sync with the Task shape.
 */
export type SortKey = "createdAt" | "title"; // placeholder — DERIVE it in milestone 4

export const sortTasks = (tasks: readonly Task[], key: SortKey): Task[] => {
  throw new Error("TODO: milestone 4");
};
