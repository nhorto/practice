/**
 * Milestone tests. Coach-mode rules:
 *
 * - Milestone blocks below use `describe.skip` because the starter stubs
 *   throw ("TODO: milestone N") — the tests would fail against the starter.
 *   When you START a milestone, delete its `.skip` and make the block green.
 * - Never edit a test to make it pass. If a test seems wrong, re-read the
 *   milestone contract in GUIDE.md first.
 */
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, expectTypeOf, it } from "vitest";

import { TASK_STATUSES, type Task, type TaskStatus } from "../src/types";
import { addTask, completeTask, filterByStatus, sortTasks } from "../src/tasks";
import { parseCommand } from "../src/parse";
import { isTask, loadTasks, saveTasks } from "../src/storage";
import { HELP_TEXT, runCommand } from "../src/run";

/** Test helper: build a Task with sensible defaults. */
const task = (overrides: Partial<Task> & Pick<Task, "id" | "title">): Task => ({
  status: "todo",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

// ---------------------------------------------------------------------------
// Milestone 0 — starter sanity (already green; leave un-skipped)
// ---------------------------------------------------------------------------
describe("milestone 0 — starter sanity", () => {
  it("derives the status union from the as-const array", () => {
    expect(TASK_STATUSES).toEqual(["todo", "done"]);
    expectTypeOf<TaskStatus>().toEqualTypeOf<"todo" | "done">();
  });

  it("prints usage from the help text", () => {
    expect(HELP_TEXT).toContain("Usage:");
    expect(HELP_TEXT).toContain("add <title>");
  });
});

// ---------------------------------------------------------------------------
// Milestone 1 — pure task functions
// (skipped: starter stubs throw — remove `.skip` when you start milestone 1)
// ---------------------------------------------------------------------------
describe.skip("milestone 1 — pure add/complete/filter", () => {
  it("adds a task with id 1 to an empty list", () => {
    const result = addTask([], "buy milk");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 1, title: "buy milk", status: "todo" });
    expect(result[0]?.createdAt).toBeTruthy();
  });

  it("assigns the next free id and does not mutate the input", () => {
    const existing = [task({ id: 1, title: "a" }), task({ id: 7, title: "b" })];
    const result = addTask(existing, "c");
    expect(result).toHaveLength(3);
    expect(result[2]).toMatchObject({ id: 8, title: "c" });
    expect(existing).toHaveLength(2); // input untouched
  });

  it("completes a task by id (sets status + completedAt)", () => {
    const before = [task({ id: 1, title: "a" }), task({ id: 2, title: "b" })];
    const after = completeTask(before, 2);
    expect(after[1]).toMatchObject({ id: 2, status: "done" });
    expect(after[1]?.completedAt).toBeTruthy();
    expect(before[1]?.status).toBe("todo"); // no mutation
  });

  it("leaves the list unchanged for an unknown id", () => {
    const before = [task({ id: 1, title: "a" })];
    expect(completeTask(before, 99)).toEqual(before);
  });

  it("filters by status", () => {
    const tasks = [
      task({ id: 1, title: "a" }),
      task({ id: 2, title: "b", status: "done" }),
    ];
    expect(filterByStatus(tasks, "done")).toEqual([tasks[1]]);
    expect(filterByStatus(tasks, "todo")).toEqual([tasks[0]]);
  });
});

// ---------------------------------------------------------------------------
// Milestone 2 — argv -> discriminated Command union
// (skipped: remove `.skip` when you start milestone 2)
// ---------------------------------------------------------------------------
describe.skip("milestone 2 — parseCommand", () => {
  it("parses add with a title", () => {
    expect(parseCommand(["add", "buy milk"])).toMatchObject({
      kind: "add",
      title: "buy milk",
    });
  });

  it("joins multi-word titles", () => {
    expect(parseCommand(["add", "buy", "oat", "milk"])).toMatchObject({
      kind: "add",
      title: "buy oat milk",
    });
  });

  it("parses done with a NUMERIC id", () => {
    expect(parseCommand(["done", "3"])).toMatchObject({ kind: "done", id: 3 });
  });

  it("parses bare list", () => {
    expect(parseCommand(["list"])).toMatchObject({ kind: "list" });
  });

  it("parses list --status done", () => {
    expect(parseCommand(["list", "--status", "done"])).toMatchObject({
      kind: "list",
      status: "done",
    });
  });

  it("treats no args / help as the help command", () => {
    expect(parseCommand([])).toMatchObject({ kind: "help" });
    expect(parseCommand(["help"])).toMatchObject({ kind: "help" });
    expect(parseCommand(["--help"])).toMatchObject({ kind: "help" });
  });

  it("returns invalid (a VALUE, not a throw) for junk input", () => {
    expect(parseCommand(["frobnicate"])).toMatchObject({ kind: "invalid" });
    expect(parseCommand(["done", "not-a-number"])).toMatchObject({
      kind: "invalid",
    });
    expect(parseCommand(["list", "--status", "banana"])).toMatchObject({
      kind: "invalid",
    });
    expect(parseCommand(["add"])).toMatchObject({ kind: "invalid" });
  });
});

// ---------------------------------------------------------------------------
// Milestone 3 — JSON persistence with hand-rolled narrowing
// (skipped: remove `.skip` when you start milestone 3)
// ---------------------------------------------------------------------------
describe.skip("milestone 3 — storage", () => {
  const freshDir = () => mkdtempSync(join(tmpdir(), "task-tracker-"));

  it("isTask accepts a valid task and rejects junk", () => {
    expect(isTask(task({ id: 1, title: "a" }))).toBe(true);
    expect(isTask(null)).toBe(false);
    expect(isTask("nope")).toBe(false);
    expect(isTask({ id: 1, title: "a" })).toBe(false); // missing fields
    expect(isTask({ ...task({ id: 1, title: "a" }), status: "banana" })).toBe(
      false, // status outside the union
    );
  });

  it("round-trips save -> load", () => {
    const file = join(freshDir(), "tasks.json");
    const tasks = [task({ id: 1, title: "a" }), task({ id: 2, title: "b", status: "done" })];
    saveTasks(file, tasks);
    expect(loadTasks(file)).toEqual(tasks);
  });

  it("returns [] for a missing file", () => {
    expect(loadTasks(join(freshDir(), "does-not-exist.json"))).toEqual([]);
  });

  it("drops invalid entries on load, keeps valid ones", () => {
    const file = join(freshDir(), "tasks.json");
    const valid = task({ id: 1, title: "a" });
    writeFileSync(
      file,
      JSON.stringify([valid, { id: "two", title: 42 }, "garbage"]),
    );
    expect(loadTasks(file)).toEqual([valid]);
  });
});

// ---------------------------------------------------------------------------
// Milestone 4 — sorting with derived types
// (skipped: remove `.skip` when you start milestone 4)
// ---------------------------------------------------------------------------
describe.skip("milestone 4 — sortTasks", () => {
  const tasks = [
    task({ id: 2, title: "banana", createdAt: "2026-02-01T00:00:00.000Z" }),
    task({ id: 1, title: "apple", createdAt: "2026-03-01T00:00:00.000Z" }),
    task({ id: 3, title: "cherry", createdAt: "2026-01-01T00:00:00.000Z" }),
  ];

  it("sorts by title alphabetically", () => {
    expect(sortTasks(tasks, "title").map((t) => t.title)).toEqual([
      "apple",
      "banana",
      "cherry",
    ]);
  });

  it("sorts by createdAt ascending", () => {
    expect(sortTasks(tasks, "createdAt").map((t) => t.id)).toEqual([3, 2, 1]);
  });

  it("does not mutate the input", () => {
    const copy = [...tasks];
    sortTasks(tasks, "createdAt");
    expect(tasks).toEqual(copy);
  });
});

// ---------------------------------------------------------------------------
// Milestone 5 — runCommand: exhaustive switch, errors as values
// (skipped: remove `.skip` when you start milestone 5)
// ---------------------------------------------------------------------------
describe.skip("milestone 5 — runCommand", () => {
  it("help returns the usage text and unchanged tasks", () => {
    const tasks = [task({ id: 1, title: "a" })];
    const result = runCommand(tasks, parseCommand(["help"]));
    expect(result.output).toContain("Usage:");
    expect(result.tasks).toEqual(tasks);
  });

  it("add appends a task and mentions it in the output", () => {
    const result = runCommand([], parseCommand(["add", "buy milk"]));
    expect(result.tasks).toHaveLength(1);
    expect(result.output).toContain("buy milk");
  });

  it("done completes the task", () => {
    const start = [task({ id: 1, title: "a" })];
    const result = runCommand(start, parseCommand(["done", "1"]));
    expect(result.tasks[0]?.status).toBe("done");
  });

  it("list output contains each title", () => {
    const start = [task({ id: 1, title: "alpha" }), task({ id: 2, title: "beta" })];
    const result = runCommand(start, parseCommand(["list"]));
    expect(result.output).toContain("alpha");
    expect(result.output).toContain("beta");
  });

  it("invalid input reports the reason WITHOUT throwing", () => {
    const start = [task({ id: 1, title: "a" })];
    const result = runCommand(start, parseCommand(["frobnicate"]));
    expect(result.tasks).toEqual(start); // state untouched
    expect(result.output.length).toBeGreaterThan(0);
  });
});
