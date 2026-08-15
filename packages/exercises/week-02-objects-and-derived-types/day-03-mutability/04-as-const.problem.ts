/**
 * Exercise 04 — `as const`
 *
 * By default an object literal infers WIDE: `{ home: "/" }` becomes
 * `{ home: string }`, and `[0, 0]` becomes `number[]`. `as const` freezes
 * the whole value: every property `readonly`, every string a literal type,
 * every array a fixed readonly tuple.
 *
 * 🎯 1. Add `as const` to `ROUTES` — the tests want the literal `"/"`, not
 *       `string`.
 *    2. Add `as const` to `ORIGIN` — a pair of coordinates, not a resizable
 *       array of unknown length.
 */
import { expect, expectTypeOf, it } from "vitest";

const ROUTES = {
  home: "/",
  settings: "/settings",
  profile: "/profile/:id",
};

const ORIGIN = [0, 0];

const isKnownRoute = (path: string): boolean => {
  return Object.values(ROUTES).some((route) => route === path);
};

// --- tests ------------------------------------------------------------------

it("infers literal route strings and readonly properties", () => {
  expectTypeOf(ROUTES.home).toEqualTypeOf<"/">();
  expectTypeOf(ROUTES).toEqualTypeOf<{
    readonly home: "/";
    readonly settings: "/settings";
    readonly profile: "/profile/:id";
  }>();
});

it("treats ORIGIN as a fixed pair", () => {
  expectTypeOf(ORIGIN).toEqualTypeOf<readonly [0, 0]>();
  const [x, y] = ORIGIN;
  expect(x + y).toBe(0);
});

it("still works at runtime", () => {
  expect(isKnownRoute("/settings")).toBe(true);
  expect(isKnownRoute("/nope")).toBe(false);
});
