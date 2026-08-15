/**
 * Exercise 04 — The `Object.keys` reality
 *
 * `Object.keys(obj)` returns `string[]`, not `(keyof typeof obj)[]` — and
 * that's deliberate: structural typing means the object may carry extra keys
 * at runtime that the type never mentioned. But when YOU know the object is
 * exactly what its type says (like a local const), a typed helper with a
 * deliberate `as` assertion is the standard move.
 *
 * 🎯 Make `objectKeys` return `(keyof T)[]` by asserting the result of
 *    `Object.keys`. That one local, documented `as` unlocks the loop in
 *    `topSubject` — don't change anything else.
 */
import { expect, expectTypeOf, it } from "vitest";

// TODO: assert the return as (keyof T)[] — the one honest place for `as`.
const objectKeys = <T extends object>(obj: T) => Object.keys(obj);

const scores = { math: 91, physics: 78, art: 88 };

const topSubject = (): string => {
  let best = "none";
  let bestScore = -Infinity;
  for (const key of objectKeys(scores)) {
    const score = scores[key];
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }
  return best;
};

// --- tests ------------------------------------------------------------------

it("finds the highest-scoring subject", () => {
  expect(topSubject()).toBe("math");
});

it("returns keys the compiler can use to index", () => {
  const keys = objectKeys(scores);
  expect([...keys].sort()).toEqual(["art", "math", "physics"]);
  expectTypeOf(keys).toEqualTypeOf<("math" | "physics" | "art")[]>();
});

it("plain Object.keys stays stringly-typed", () => {
  expectTypeOf(Object.keys(scores)).toEqualTypeOf<string[]>();
});
