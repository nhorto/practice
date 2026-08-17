/**
 * Exercise 03 — Rest parameters and `void` (solution)
 *
 * `...values: number[]` — the rest annotation is the type of the collected
 * array. `(item: string, index: number) => void` — void means "return value
 * ignored", so callbacks that return something still fit.
 */
import { expect, expectTypeOf, it } from "vitest";

const average = (...values: number[]) => {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const forEachItem = (
  items: string[],
  visit: (item: string, index: number) => void,
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
