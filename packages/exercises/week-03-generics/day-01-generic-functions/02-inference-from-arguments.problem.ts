/**
 * Exercise 02 — Inference from arguments
 *
 * `unknown` type-checks, but it's a one-way street: once data flows in as
 * `unknown`, the caller can never get the real type back out. Type parameters
 * fix this — TypeScript infers them from the ARGUMENTS at each call site, so
 * the connection between input and output survives.
 *
 * 🎯 Rewrite both functions with type parameters (two each) so the element
 *    and result types flow through. The bodies are already correct.
 */
import { expect, expectTypeOf, it } from "vitest";

const mapItems = (items: unknown[], transform: (item: unknown) => unknown) => {
  return items.map(transform);
};

const zip = (left: unknown[], right: unknown[]): [unknown, unknown][] => {
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
