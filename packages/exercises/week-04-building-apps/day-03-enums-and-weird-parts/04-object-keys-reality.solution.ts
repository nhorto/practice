/**
 * Exercise 04 — The `Object.keys` reality (solution)
 *
 * The assertion lives in ONE tiny helper with an honest name, not scattered
 * through the codebase. It's a claim the compiler can't verify — you're
 * promising the object has no extra keys — which is why the built-in typing
 * refuses to make it for you.
 */
import { expect, expectTypeOf, it } from "vitest";

const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[];

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
