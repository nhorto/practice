/**
 * Exercise 01 — Maybe<T>
 *
 * Type aliases can take type parameters too. `Maybe` below models a value
 * that might not be there — but with `value: unknown` it forgets WHAT is
 * (maybe) there, so every consumer has to guess.
 *
 * 🎯 1. Make `Maybe` generic: `Maybe<T>` with `value: T` in the "some" arm.
 *    2. Make both functions generic so `T` flows from the items array all
 *       the way out of `withDefault`.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Maybe = { kind: "some"; value: unknown } | { kind: "none" };

const firstMatch = (items: unknown[], matches: (item: unknown) => boolean): Maybe => {
  for (const item of items) {
    if (matches(item)) {
      return { kind: "some", value: item };
    }
  }
  return { kind: "none" };
};

const withDefault = (maybe: Maybe, fallback: unknown) =>
  maybe.kind === "some" ? maybe.value : fallback;

// --- tests ------------------------------------------------------------------

it("finds the first match", () => {
  const found = firstMatch([1, 8, 3], (n) => n > 5);
  expect(found).toEqual({ kind: "some", value: 8 });
  expectTypeOf(found).toEqualTypeOf<Maybe<number>>();
});

it("returns none when nothing matches", () => {
  expect(firstMatch([1, 2], (n) => n > 5)).toEqual({ kind: "none" });
});

it("unwraps with a typed fallback", () => {
  const found = firstMatch(["ada", "grace"], (name) => name.startsWith("g"));
  const name = withDefault(found, "nobody");
  expect(name).toBe("grace");
  expectTypeOf(name).toEqualTypeOf<string>();
});
