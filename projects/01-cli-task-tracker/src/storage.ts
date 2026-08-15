/**
 * JSON-file persistence — milestone 3.
 *
 * The file on disk is a BOUNDARY: whatever JSON.parse returns is `unknown`
 * until *you* prove otherwise with hand-rolled narrowing (this is the
 * pre-Zod week — in project 03 a schema will do this job).
 */
import type { Task } from "./types";

/** Where the CLI keeps its data unless told otherwise. */
export const DEFAULT_DB_PATH = "tasks.json";

/**
 * Milestone 3 — type guard proving an unknown value is a Task.
 * Must check every required property (and the status union!) — no `as`.
 */
export const isTask = (value: unknown): value is Task => {
  throw new Error("TODO: milestone 3");
};

/**
 * Milestone 3 — read tasks from `filePath`.
 * - Missing file -> [] (a fresh start is not an error).
 * - Entries that fail `isTask` are dropped, valid ones survive.
 */
export const loadTasks = (filePath: string): Task[] => {
  throw new Error("TODO: milestone 3");
};

/** Milestone 3 — write tasks to `filePath` as pretty-printed JSON. */
export const saveTasks = (filePath: string, tasks: readonly Task[]): void => {
  throw new Error("TODO: milestone 3");
};
