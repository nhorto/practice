/**
 * Exercise 02 — Literal types
 *
 * A literal type is a single exact value used as a type: `"asc"` is a type
 * that only the string "asc" satisfies. Union a few together and you get an
 * enum-without-the-enum: `"asc" | "desc"`.
 *
 * Inference follows the same idea: `const method = "GET"` infers the literal
 * type `"GET"` (it can never change), but `let method = "GET"` widens to
 * `string` (it might be reassigned).
 *
 * 🎯 1. Replace `string` in the `Direction` alias with the two real options.
 *    2. Change `let` to `const` below so `defaultDirection` keeps its
 *       literal type.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Direction = string;

let defaultDirection = "asc";

const sortNumbers = (values: number[], direction: Direction) => {
  const sorted = [...values].sort((a, b) => a - b);
  return direction === "desc" ? sorted.reverse() : sorted;
};

// --- tests ------------------------------------------------------------------

it("sorts ascending and descending", () => {
  expect(sortNumbers([3, 1, 2], "asc")).toEqual([1, 2, 3]);
  expect(sortNumbers([3, 1, 2], "desc")).toEqual([3, 2, 1]);
});

it("has the correct types", () => {
  expectTypeOf<Direction>().toEqualTypeOf<"asc" | "desc">();
  expectTypeOf(defaultDirection).toEqualTypeOf<"asc">();

  // With a literal union, typos stop compiling:
  // @ts-expect-error — "sideways" is not a Direction
  sortNumbers([1, 2, 3], "sideways");
});
