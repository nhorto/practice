/**
 * Exercise 03 — Constraints (solution)
 *
 * The constraint is the minimum the body needs:
 * - `K extends keyof T` — K must be a real key, so `obj[key]` is `T[K]`
 * - `T extends { length: number }` — anything with a length qualifies
 * - `T extends object` — spreading only works on object types
 */
import { expect, expectTypeOf, it } from "vitest";

const getProp = <T, K extends keyof T>(obj: T, key: K) => obj[key];

const longest = <T extends { length: number }>(a: T, b: T) =>
  a.length >= b.length ? a : b;

const mergeDefaults = <T extends object>(defaults: T, overrides: Partial<T>): T => ({
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
