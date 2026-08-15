/**
 * Exercise 02 — Type predicates (solution)
 *
 * `value is string` makes the return value MEAN something to the compiler:
 * true narrows the argument in that branch. `.filter` has an overload that
 * looks for predicates, which is why `filter(isDefined)` can shrink
 * `(string | null | undefined)[]` to `string[]`.
 */
import { expect, expectTypeOf, it } from "vitest";

const isString = (value: unknown): value is string => typeof value === "string";

const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

// --- tests ------------------------------------------------------------------

it("narrows unknown to string in an if", () => {
  const value: unknown = "hello";
  if (isString(value)) {
    expectTypeOf(value).toEqualTypeOf<string>();
    expect(value.toUpperCase()).toBe("HELLO");
  } else {
    throw new Error("expected a string");
  }
});

it("filters a mixed array down to strings", () => {
  const mixed: unknown[] = ["ts", 1, "js", null];
  const strings = mixed.filter(isString);
  expect(strings).toEqual(["ts", "js"]);
  expectTypeOf(strings).toEqualTypeOf<string[]>();
});

it("filters out null and undefined", () => {
  const maybeNames = ["ada", null, "grace", undefined];
  const names = maybeNames.filter(isDefined);
  expect(names).toEqual(["ada", "grace"]);
  expectTypeOf(names).toEqualTypeOf<string[]>();
});
