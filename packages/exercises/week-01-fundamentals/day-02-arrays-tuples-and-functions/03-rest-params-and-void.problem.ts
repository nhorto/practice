/**
 * Exercise 03 — Rest parameters and `void`
 *
 * Rest parameters collect "any number of arguments" into an array, so their
 * annotation is an ARRAY type: `(...values: number[])`.
 *
 * `void` in a callback type means "whatever you return will be ignored" —
 * it does NOT force the callback to return nothing. That's why typing a
 * callback as returning `undefined` (like below) is too strict: perfectly
 * good callbacks such as `(item) => seen.push(item)` return a number.
 *
 * 🎯 1. Annotate the rest parameter of `average`.
 *    2. Fix `forEachItem`'s callback type: it should return `void`.
 *    Don't change any function bodies.
 */
import { expect, expectTypeOf, it } from "vitest";

const average = (...values) => {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const forEachItem = (
  items: string[],
  visit: (item: string, index: number) => undefined,
) => {
  items.forEach((item, index) => visit(item, index));
};

// --- tests ------------------------------------------------------------------

it("averages any number of values", () => {
  expect(average(1, 2, 3)).toBe(2);
  expect(average(10, 20, 30, 40)).toBe(25);
});

it("visits every item — even with a callback that returns something", () => {
  const seen: string[] = [];
  // `push` returns a number; a `void` callback type happily accepts that.
  forEachItem(["a", "b", "c"], (item) => seen.push(item));
  expect(seen).toEqual(["a", "b", "c"]);
});

it("has the correct types", () => {
  expectTypeOf(average).toEqualTypeOf<(...values: number[]) => number>();
  expectTypeOf(forEachItem).parameter(1).toEqualTypeOf<
    (item: string, index: number) => void
  >();
});
