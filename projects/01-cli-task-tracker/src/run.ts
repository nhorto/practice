/**
 * Command execution — milestone 5.
 *
 * A pure function from (current tasks, command) to (new tasks, output text).
 * cli.ts stays a thin shell: load -> parse -> runCommand -> save -> print.
 * Being pure makes the whole app testable without touching the filesystem.
 */
import type { Task } from "./types";
import type { Command } from "./parse";

export type RunResult = {
  tasks: Task[];
  output: string;
};

export const HELP_TEXT = `task-tracker — a tiny typed todo CLI

Usage:
  pnpm start add <title>            add a task
  pnpm start done <id>              complete a task
  pnpm start list [--status s]      list tasks (s: todo | done)
  pnpm start help                   show this help
`;

/**
 * Milestone 5 — exhaustive switch over command.kind with a `never` check in
 * the default branch, so a new command variant becomes a compile error here.
 */
export const runCommand = (
  tasks: readonly Task[],
  command: Command,
): RunResult => {
  throw new Error("TODO: milestone 5");
};
