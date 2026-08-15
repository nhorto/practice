/**
 * Exercise 02 — Derive row types, don't declare them (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const habits = sqliteTable("habits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  cadence: text("cadence", { enum: ["daily", "weekly"] }).notNull(),
  target: integer("target").notNull().default(1),
  notes: text("notes"),
});

// One source of truth: both types derive from the table.
export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;

// --- tests ------------------------------------------------------------------

it("the schema object is the runtime source of truth", () => {
  expect(habits.notes.notNull).toBe(false);
  expect(habits.target.hasDefault).toBe(true);
});

it("Habit mirrors the table exactly", () => {
  expectTypeOf<Habit>().toEqualTypeOf<{
    id: number;
    name: string;
    cadence: "daily" | "weekly";
    target: number;
    notes: string | null;
  }>();
});

it("NewHabit makes db-filled columns optional", () => {
  expectTypeOf<NewHabit>().toEqualTypeOf<{
    id?: number;
    name: string;
    cadence: "daily" | "weekly";
    target?: number;
    notes?: string | null;
  }>();
});

it("a minimal insert needs only name and cadence", () => {
  const draft: NewHabit = { name: "stretch", cadence: "daily" };
  expect(draft.name).toBe("stretch");
});
