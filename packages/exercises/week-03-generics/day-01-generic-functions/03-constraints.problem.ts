/**
 * Exercise 03 — Constraints
 *
 * An unconstrained `T` could be ANYTHING — so TypeScript won't let the body
 * index into it, read `.length`, or spread it. `T extends Something` is a
 * promise about what T can do, which unlocks those operations in the body AND
 * rejects bad arguments at the call site.
 *
 * 🎯 Add `extends` constraints (and for `getProp`, a second type parameter
 *    constrained to `keyof T`) until every error below disappears and all
 *    tests pass. Don't change the function bodies.
 */
import { expect, expectTypeOf, it } from "vitest";

const getProp = <T>(obj: T, key: string) => obj[key];

const longest = <T>(a: T, b: T) => (a.length >= b.length ? a : b);

const mergeDefaults = <T>(defaults: T, overrides: Partial<T>): T => ({
  ...defaults,
  ...overrides,
});

// --- tests ------------------------------------------------------------------

const track = { title: "Purple Rain", plays: 12 };

it("gets a property with its precise type", () => {
  expect(getProp(track, "title")).toBe("Purple Rain");
  expectTypeOf(getProp(track, "plays")).toEqualTypeOf<number>();
});

it("rejects keys that don't exist", () => {
  // @ts-expect-error — "artist" is not a key of track
  getProp(track, "artist");
});

it("picks the longest of two values", () => {
  expect(longest("short", "loooong")).toBe("loooong");
  expect(longest([1, 2], [1, 2, 3])).toEqual([1, 2, 3]);
  expectTypeOf(longest("a", "b")).toEqualTypeOf<string>();
});

it("rejects values without a length", () => {
  // @ts-expect-error — numbers have no .length
  longest(1, 2);
});

it("merges overrides into defaults", () => {
  const settings = mergeDefaults({ theme: "light", fontSize: 14 }, { fontSize: 18 });
  expect(settings).toEqual({ theme: "light", fontSize: 18 });
  expectTypeOf(settings).toEqualTypeOf<{ theme: string; fontSize: number }>();
});
