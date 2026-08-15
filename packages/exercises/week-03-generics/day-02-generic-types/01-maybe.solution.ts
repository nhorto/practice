/**
 * Exercise 01 — Maybe<T> (solution)
 *
 * `Maybe<T>` is a generic type alias: the discriminated union structure stays
 * fixed while `T` plugs in per use. The functions thread the same `T` through,
 * so `withDefault(firstMatch(names, ...), "nobody")` is a `string` — no casts,
 * no guessing.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Maybe<T> = { kind: "some"; value: T } | { kind: "none" };

const firstMatch = <T>(items: T[], matches: (item: T) => boolean): Maybe<T> => {
  for (const item of items) {
    if (matches(item)) {
      return { kind: "some", value: item };
    }
  }
  return { kind: "none" };
};

const withDefault = <T>(maybe: Maybe<T>, fallback: T): T =>
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
