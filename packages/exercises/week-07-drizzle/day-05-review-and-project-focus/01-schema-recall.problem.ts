/**
 * Drill 01 — Schema recall
 *
 * From memory — no peeking at day 1. Every column below is missing its
 * modifiers, and `Intensity` is hand-declared instead of derived.
 *
 * 🎯 The spec:
 *    - `id` — auto-increment primary key
 *    - `activity` — text, required
 *    - `minutes` — integer, required
 *    - `intensity` — text enum "low" | "medium" | "high", required,
 *      defaults to "medium"
 *    - `notes` — text, genuinely optional (nullable)
 *    Then derive `Intensity` from the column (`enumValues`), not by hand.
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
  id: integer("id"),
  activity: text("activity"),
  minutes: integer("minutes"),
  intensity: text("intensity"),
  notes: text("notes"),
});

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

// ❌ hand-declared — derive it from the column
export type Intensity = string;

// --- tests ------------------------------------------------------------------

it("modifiers are recorded on the schema object", () => {
  expect(workouts.id.primary).toBe(true);
  expect(workouts.activity.notNull).toBe(true);
  expect(workouts.minutes.notNull).toBe(true);
  expect(workouts.intensity.hasDefault).toBe(true);
  expect(workouts.intensity.default).toBe("medium");
  expect(workouts.notes.notNull).toBe(false);
});

it("select and insert types fall out of the modifiers", () => {
  expectTypeOf<Workout>().toEqualTypeOf<{
    id: number;
    activity: string;
    minutes: number;
    intensity: "low" | "medium" | "high";
    notes: string | null;
  }>();
  expectTypeOf<NewWorkout>().toEqualTypeOf<{
    id?: number;
    activity: string;
    minutes: number;
    intensity?: "low" | "medium" | "high";
    notes?: string | null;
  }>();
});

it("Intensity derives from the column", () => {
  expectTypeOf<Intensity>().toEqualTypeOf<"low" | "medium" | "high">();
});
