/**
 * Exercise 04 — optional vs nullable vs nullish (solution)
 *
 * `.optional()` → `T | undefined` (key may be missing), `.nullable()` →
 * `T | null` (key present, value may be null), `.nullish()` → both. The
 * schema documents the wire format, and z.infer hands that contract to the
 * rest of the codebase.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const ProfileSchema = z.object({
  username: z.string(),
  nickname: z.string().optional(),
  avatarUrl: z.url().nullable(),
  lastSeenAt: z.number().nullish(),
});

type Profile = z.infer<typeof ProfileSchema>;

const displayName = (profile: Profile): string => {
  return profile.nickname ?? profile.username;
};

// --- tests ------------------------------------------------------------------

it("accepts a profile with everything filled in", () => {
  expect(
    ProfileSchema.parse({
      username: "ada",
      nickname: "The Countess",
      avatarUrl: "https://example.com/ada.png",
      lastSeenAt: 1735689600,
    }),
  ).toEqual({
    username: "ada",
    nickname: "The Countess",
    avatarUrl: "https://example.com/ada.png",
    lastSeenAt: 1735689600,
  });
});

it("accepts omitted nickname, null avatar, and missing/null lastSeenAt", () => {
  expect(
    ProfileSchema.parse({ username: "ada", avatarUrl: null }),
  ).toEqual({ username: "ada", avatarUrl: null });
  expect(
    ProfileSchema.parse({ username: "ada", avatarUrl: null, lastSeenAt: null }),
  ).toEqual({ username: "ada", avatarUrl: null, lastSeenAt: null });
});

it("still rejects the wrong shapes", () => {
  // nickname may be omitted, but null is not allowed:
  expect(
    ProfileSchema.safeParse({ username: "ada", nickname: null, avatarUrl: null })
      .success,
  ).toBe(false);
  // avatarUrl may be null, but not omitted:
  expect(ProfileSchema.safeParse({ username: "ada" }).success).toBe(false);
  // ...and when present it must be a valid URL:
  expect(
    ProfileSchema.safeParse({ username: "ada", avatarUrl: "not a url" }).success,
  ).toBe(false);
});

it("falls back to the username when nickname is absent", () => {
  expect(displayName(ProfileSchema.parse({ username: "ada", avatarUrl: null }))).toBe(
    "ada",
  );
});

it("infers the three different maybes", () => {
  expectTypeOf<Profile>().toEqualTypeOf<{
    username: string;
    nickname?: string | undefined;
    avatarUrl: string | null;
    lastSeenAt?: number | null | undefined;
  }>();
});
