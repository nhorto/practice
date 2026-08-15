/**
 * Exercise 02 — Inference from arguments (solution)
 *
 * `mapItems(["aa"], (word) => word.length)` gives TypeScript two inference
 * sites: `items` fixes TItem = string, and the callback's return fixes
 * TResult = number. The caller writes zero type annotations and still gets
 * `number[]` back — that's the whole point of generics.
 */
import { expect, expectTypeOf, it } from "vitest";

const mapItems = <TItem, TResult>(
  items: TItem[],
  transform: (item: TItem) => TResult,
) => {
  return items.map(transform);
};

const zip = <A, B>(left: A[], right: B[]): [A, B][] => {
  // slice guarantees an element exists at every index we touch, so `!` is safe
  return left.slice(0, right.length).map((item, i) => [item, right[i]!]);
};

// --- tests ------------------------------------------------------------------

it("maps numbers to strings", () => {
  expect(mapItems([1, 2, 3], (n) => `#${n}`)).toEqual(["#1", "#2", "#3"]);
});

it("infers types end to end", () => {
  const lengths = mapItems(["aa", "b", "cccc"], (word) => word.length);
  expect(lengths).toEqual([2, 1, 4]);
  expectTypeOf(lengths).toEqualTypeOf<number[]>();
});

it("zips two arrays into pairs", () => {
  const zipped = zip(["a", "b", "c"], [1, 2]);
  expect(zipped).toEqual([
    ["a", 1],
    ["b", 2],
  ]);
  expectTypeOf(zipped).toEqualTypeOf<[string, number][]>();
});
