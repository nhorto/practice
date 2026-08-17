/**
 * Exercise 01 — MyPick
 * (type-challenges #4 "Pick", rebuilt from scratch)
 *
 * `Pick<T, K>` is just a mapped type: loop over the keys in K, look each one
 * up on T. Rebuilding it teaches the single most-used piece of type-level
 * machinery there is.
 *
 * 🎯 Implement `MyPick` with a mapped type — without using the built-in
 *    `Pick`. The placeholder below returns T untouched.
 */
import { expect, expectTypeOf, it } from "vitest";

type MyPick<T, K extends keyof T> = T;

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
