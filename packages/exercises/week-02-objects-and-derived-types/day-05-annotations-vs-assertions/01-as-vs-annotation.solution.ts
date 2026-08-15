/**
 * Exercise 01 — `as` vs annotation (solution)
 *
 * The annotation caught the missing `theme` immediately — that's what
 * checking buys you. The `as` stays only at the JSON boundary, where the
 * compiler genuinely cannot know the shape (week 5 replaces even that with
 * schema validation).
 */
import { expect, expectTypeOf, it } from "vitest";

type UserProfile = {
  id: string;
  name: string;
  theme: "light" | "dark";
};

const profile: UserProfile = {
  id: "u1",
  name: "Ada",
  theme: "dark",
};

const parseProfile = (raw: string) => {
  return JSON.parse(raw) as UserProfile;
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
