/**
 * Exercise 02 — Literal types (solution)
 *
 * `"asc" | "desc"` makes the invalid call impossible to write, and the IDE
 * now autocompletes the two valid options. `const` keeps the literal type
 * `"asc"`; `let` would widen it to `string` because it could be reassigned.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Direction = "asc" | "desc";

const defaultDirection = "asc";

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
  expectTypeOf<typeof defaultDirection>().toEqualTypeOf<"asc">();

  // With a literal union, typos stop compiling:
  // @ts-expect-error — "sideways" is not a Direction
  sortNumbers([1, 2, 3], "sideways");
});
