/**
 * Drill 01 — Schema recall (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  activity: text("activity").notNull(),
  minutes: integer("minutes").notNull(),
  intensity: text("intensity", { enum: ["low", "medium", "high"] })
    .notNull()
    .default("medium"),
  notes: text("notes"),
});

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

// Derived from the column — one source of truth.
export type Intensity = (typeof workouts.intensity.enumValues)[number];

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
