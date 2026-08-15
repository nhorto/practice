/**
 * Exercise 01 — `import type` and `export type` (solution)
 *
 * Under `verbatimModuleSyntax`, type-only imports must say so. The inline
 * form `{ vi, type Mock }` works, and so does a separate
 * `import type { Mock } from "vitest"` statement. Same for exports:
 * `export type { Task }` (or `export { type Task, ... }`).
 */
import { expect, expectTypeOf, it, vi, type Mock } from "vitest";

type Task = { id: string; title: string; done: boolean };

const completeTask = (task: Task): Task => ({ ...task, done: true });

// `vi.fn()` wraps a function so tests can observe its calls — `vi` must
// exist at runtime for this to work.
const spyOn = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): Mock<(...args: Args) => Return> => vi.fn(fn);

export { completeTask, spyOn };
export type { Task };

// --- tests ------------------------------------------------------------------

it("completes a task", () => {
  const done = completeTask({ id: "t1", title: "Ship it", done: false });
  expect(done).toEqual({ id: "t1", title: "Ship it", done: true });
});

it("wraps a function in a spy", () => {
  const spy = spyOn((id: string) => `loaded:${id}`);
  expect(spy("42")).toBe("loaded:42");
  expect(spy).toHaveBeenCalledTimes(1);
});

it("has the correct types", () => {
  expectTypeOf(completeTask).toEqualTypeOf<(task: Task) => Task>();
  expectTypeOf(spyOn((n: number) => n * 2)).toEqualTypeOf<
    Mock<(n: number) => number>
  >();
});
