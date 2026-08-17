/**
 * Exercise 03 — `readonly` arrays (solution)
 *
 * With `readonly number[]`, `scores.sort(...)` no longer compiles — the
 * copy-then-sort version is the only one the compiler accepts, and it's
 * also the correct one.
 */
import { expect, expectTypeOf, it } from "vitest";

const topScores = (scores: readonly number[], count: number): number[] => {
  return [...scores].sort((a, b) => b - a).slice(0, count);
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
