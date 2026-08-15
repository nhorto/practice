/**
 * Exercise 02 — .parse vs .safeParse (solution)
 *
 * `.safeParse` returns a discriminated union, so checking `result.success`
 * narrows it: `result.data` only exists on the success branch. No try/catch,
 * no throwing on messy input.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const ScoreSchema = z.object({
  player: z.string(),
  points: z.number().int().min(0),
});

type Score = z.infer<typeof ScoreSchema>;

const parseScore = (data: unknown): Score | null => {
  const result = ScoreSchema.safeParse(data);
  return result.success ? result.data : null;
};

const pointsOrZero = (data: unknown): number => {
  const result = ScoreSchema.safeParse(data);
  return result.success ? result.data.points : 0;
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
