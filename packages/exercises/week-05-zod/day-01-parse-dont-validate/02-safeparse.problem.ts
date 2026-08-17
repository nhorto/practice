/**
 * Exercise 02 — .parse vs .safeParse
 *
 * `.parse` throws a ZodError on bad data — right for boundaries where bad
 * data is a bug. `.safeParse` never throws: it returns a discriminated union
 * `{ success: true; data } | { success: false; error }`, so `result.success`
 * narrows exactly like the unions you built in week 2 — right for input you
 * expect to be messy.
 *
 * 🎯 Rewrite both functions with `ScoreSchema.safeParse` so they NEVER throw:
 *    `parseScore` returns the parsed score or `null`, `pointsOrZero` returns
 *    the points or `0`.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const ScoreSchema = z.object({
  player: z.string(),
  points: z.number().int().min(0),
});

type Score = z.infer<typeof ScoreSchema>;

const parseScore = (data: unknown): Score | null => {
  // TODO: .parse throws on bad data — use .safeParse and return null instead.
  return ScoreSchema.parse(data);
};

const pointsOrZero = (data: unknown): number => {
  // TODO: safeParse, then narrow on `result.success` to reach `result.data`.
  return ScoreSchema.parse(data).points;
};

// --- tests ------------------------------------------------------------------

it("parses a valid score", () => {
  expect(parseScore({ player: "Ada", points: 120 })).toEqual({
    player: "Ada",
    points: 120,
  });
});

it("returns null instead of throwing on bad data", () => {
  expect(parseScore({ player: "Eve", points: -5 })).toBeNull();
  expect(parseScore("not even an object")).toBeNull();
});

it("falls back to zero points without throwing", () => {
  expect(pointsOrZero({ player: "Ada", points: 42 })).toBe(42);
  expect(pointsOrZero({ player: "Mallory" })).toBe(0);
  expect(pointsOrZero(undefined)).toBe(0);
});

it("has the correct types", () => {
  expectTypeOf(parseScore).toEqualTypeOf<(data: unknown) => Score | null>();
  expectTypeOf(pointsOrZero).toEqualTypeOf<(data: unknown) => number>();
});
