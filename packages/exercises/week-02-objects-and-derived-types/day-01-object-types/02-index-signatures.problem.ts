/**
 * Exercise 02 — Index signatures
 *
 * When you can't know the keys ahead of time — a tally, a cache, a lookup
 * table built at runtime — describe the VALUES and let the keys be any
 * string: `{ [word: string]: number }`. Under `noUncheckedIndexedAccess`,
 * reading such a key gives `number | undefined`, which keeps you honest
 * about entries that were never written.
 *
 * 🎯 1. Give `counts` a type with an index signature so string keys can be
 *       assigned.
 *    2. Implement the counting loop (`??` handles a word's first occurrence).
 *    3. Annotate `getCount`'s parameters and make it return `0` for words
 *       that were never seen.
 */
import { expect, expectTypeOf, it } from "vitest";

const countWords = (text: string) => {
  const counts = {};
  // TODO: loop over text.split(" ") and count each word.
  return counts;
};

const getCount = (counts, word) => {
  // TODO: return the count for `word`, or 0 if it was never seen.
  return 0;
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
