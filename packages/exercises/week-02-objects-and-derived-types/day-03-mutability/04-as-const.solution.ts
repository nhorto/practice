/**
 * Exercise 04 — `as const` (solution)
 *
 * `as const` freezes inference: literal values, readonly properties, and a
 * real `readonly [0, 0]` tuple — so destructuring gives two numbers, not
 * two `number | undefined`s.
 */
import { expect, expectTypeOf, it } from "vitest";

const ROUTES = {
  home: "/",
  settings: "/settings",
  profile: "/profile/:id",
} as const;

const ORIGIN = [0, 0] as const;

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
