/**
 * Exercise 04 — optional vs nullable vs nullish
 *
 * Three different "maybe"s, three different wire formats:
 *   - `.optional()`  — the key may be MISSING            → `T | undefined`
 *   - `.nullable()`  — the key is present but may be null → `T | null`
 *   - `.nullish()`   — either                             → `T | null | undefined`
 * Choose based on what the data source actually sends, and the inferred type
 * tells everyone downstream exactly which cases they must handle.
 *
 * 🎯 The API docs say: `nickname` may be omitted entirely; `avatarUrl` is
 *    always present but is `null` until the user uploads one (a valid URL
 *    after that — use `z.url()`); `lastSeenAt` may be missing OR null.
 *    Fix the three fields.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const ProfileSchema = z.object({
  username: z.string(),
  // TODO: may be omitted entirely.
  nickname: z.string(),
  // TODO: always present, null until uploaded, otherwise a valid URL.
  avatarUrl: z.string(),
  // TODO: may be missing or null.
  lastSeenAt: z.number(),
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
