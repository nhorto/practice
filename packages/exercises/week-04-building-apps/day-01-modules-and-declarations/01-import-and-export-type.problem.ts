/**
 * Exercise 01 — `import type` and `export type`
 *
 * This repo sets `verbatimModuleSyntax: true`, so the compiler will not
 * quietly guess which imports are types: a type imported without the `type`
 * keyword is an error, and a value imported with `import type` is erased
 * from the emitted JavaScript — so it can't be used at runtime. What you
 * write is exactly what ships.
 *
 * 🎯 Fix the imports and the exports below (don't touch the bodies or tests):
 *    1. `Mock` is a TYPE — it needs a `type` modifier.
 *    2. `vi` is a VALUE used at runtime — it must NOT be behind `import type`.
 *    3. `Task` is a type — re-export it with `export type`.
 */
import { expect, expectTypeOf, it, Mock } from "vitest";
import type { vi } from "vitest";

type Task = { id: string; title: string; done: boolean };

const completeTask = (task: Task): Task => ({ ...task, done: true });

// `vi.fn()` wraps a function so tests can observe its calls — `vi` must
// exist at runtime for this to work.
const spyOn = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): Mock<(...args: Args) => Return> => vi.fn(fn);

export { Task, completeTask, spyOn };

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
