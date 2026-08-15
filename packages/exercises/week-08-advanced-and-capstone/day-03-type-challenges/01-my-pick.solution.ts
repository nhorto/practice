/**
 * Exercise 01 — MyPick (solution)
 *
 * `{ [P in K]: T[P] }` reads as a loop: "for each member P of the union K,
 * emit a property named P whose type is T[P] (indexed access)".
 *
 * The heavy lifting is split between two features:
 * - the CONSTRAINT `K extends keyof T` rejects bad keys at the call site
 *   ("deadline" isn't a key of Todo, so `MyPick<Todo, "deadline">` errors),
 * - the MAPPED TYPE builds the result from whatever survives.
 *
 * This is exactly how the built-in `Pick` is defined in lib.es5.d.ts.
 */
import { expect, expectTypeOf, it } from "vitest";

type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// --- tests ------------------------------------------------------------------

type Todo = {
  title: string;
  description: string;
  completed: boolean;
};

it("picks a subset of keys", () => {
  expectTypeOf<MyPick<Todo, "title" | "completed">>().toEqualTypeOf<{
    title: string;
    completed: boolean;
  }>();
  expectTypeOf<MyPick<Todo, "description">>().toEqualTypeOf<{
    description: string;
  }>();
});

it("produces a usable object type", () => {
  const preview: MyPick<Todo, "title" | "completed"> = {
    title: "learn mapped types",
    completed: false,
  };
  expect(preview.completed).toBe(false);
});

it("rejects keys that don't exist on T", () => {
  // @ts-expect-error "deadline" is not a key of Todo
  type Bad = MyPick<Todo, "deadline">;
  expect(true).toBe(true);
});
