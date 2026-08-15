/**
 * Exercise 01 — `as` vs annotation
 *
 * An annotation (`: T`) asks the compiler to CHECK the value. An assertion
 * (`as T`) tells it to TRUST you — checking stops. Below, `as` is used in
 * both the wrong place and the right one:
 *
 *   - `profile` uses `as` on a literal the compiler could easily check —
 *     and the object is incomplete, so `as` is hiding a real bug.
 *   - `parseProfile` is a genuine boundary: `JSON.parse` returns `any`, the
 *     compiler can't know the shape. That's where `as` belongs.
 *
 * 🎯 1. Change `profile` to use an annotation (`: UserProfile`) and let the
 *       compiler tell you what's missing (theme should be "dark").
 *    2. In `parseProfile`, assert the parsed value `as UserProfile` so the
 *       function's return type is honest.
 */
import { expect, expectTypeOf, it } from "vitest";

type UserProfile = {
  id: string;
  name: string;
  theme: "light" | "dark";
};

const profile = {
  id: "u1",
  name: "Ada",
} as UserProfile;

const parseProfile = (raw: string) => {
  return JSON.parse(raw);
};

// --- tests ------------------------------------------------------------------

it("profile is actually complete", () => {
  expect(profile).toEqual({ id: "u1", name: "Ada", theme: "dark" });
  expect(profile.theme).toBe("dark");
});

it("parses a profile from JSON with a typed result", () => {
  const parsed = parseProfile('{"id":"u2","name":"Grace","theme":"light"}');
  expect(parsed.theme).toBe("light");
  expectTypeOf(parseProfile).toEqualTypeOf<(raw: string) => UserProfile>();
});
