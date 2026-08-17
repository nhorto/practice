/**
 * Exercise 02 — Index signatures (solution)
 *
 * The index signature lets any string key through; `noUncheckedIndexedAccess`
 * makes every read `number | undefined`, so both the counting loop and
 * `getCount` handle the missing case with `?? 0`.
 */
import { expect, expectTypeOf, it } from "vitest";

const countWords = (text: string) => {
  const counts: { [word: string]: number } = {};
  for (const word of text.split(" ")) {
    counts[word] = (counts[word] ?? 0) + 1;
  }
  return counts;
};

const getCount = (counts: { [word: string]: number }, word: string): number => {
  return counts[word] ?? 0;
};

// --- tests ------------------------------------------------------------------

it("counts each word", () => {
  expect(countWords("the cat and the hat")).toEqual({
    the: 2,
    cat: 1,
    and: 1,
    hat: 1,
  });
});

it("reads counts with a safe fallback", () => {
  const counts = countWords("a b a");
  expect(getCount(counts, "a")).toBe(2);
  expect(getCount(counts, "b")).toBe(1);
  expect(getCount(counts, "zebra")).toBe(0);
});

it("has the correct types", () => {
  expectTypeOf(countWords).toEqualTypeOf<
    (text: string) => { [word: string]: number }
  >();
  expectTypeOf(getCount).toEqualTypeOf<
    (counts: { [word: string]: number }, word: string) => number
  >();
});
