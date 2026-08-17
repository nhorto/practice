/**
 * Exercise 03 — `readonly` arrays
 *
 * `.sort()` sorts IN PLACE — this function quietly rearranges its caller's
 * array. Declaring the parameter `readonly number[]` makes the compiler
 * ban every mutating method (`sort`, `push`, `splice`, …), which forces the
 * honest version: copy first, then sort the copy. Bonus: a `readonly`
 * parameter accepts BOTH mutable and readonly arrays.
 *
 * 🎯 1. Change `scores` to `readonly number[]`.
 *    2. Follow the compiler: copy (`[...scores]`) before sorting.
 */
import { expect, expectTypeOf, it } from "vitest";

const topScores = (scores: number[], count: number): number[] => {
  return scores.sort((a, b) => b - a).slice(0, count);
};

// --- tests ------------------------------------------------------------------

it("returns the top scores, highest first", () => {
  expect(topScores([50, 90, 70, 85], 2)).toEqual([90, 85]);
  expect(topScores([3, 1, 2], 3)).toEqual([3, 2, 1]);
});

it("does not mutate its input", () => {
  const scores = [50, 90, 70];
  topScores(scores, 2);
  expect(scores).toEqual([50, 90, 70]);
});

it("accepts a readonly array", () => {
  const frozen: readonly number[] = [1, 3, 2];
  expect(topScores(frozen, 1)).toEqual([3]);
  expectTypeOf(topScores).parameter(0).toEqualTypeOf<readonly number[]>();
});
