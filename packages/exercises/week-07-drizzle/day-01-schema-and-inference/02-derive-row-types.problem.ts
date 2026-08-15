/**
 * Exercise 02 — Derive row types, don't declare them
 *
 * Someone hand-wrote `Habit` and `NewHabit` next to the table… and they have
 * already drifted: the enum column narrowed to plain `string`, the nullable
 * column lost its `| null`, and `NewHabit` demands values the database can
 * fill in itself. This is exactly why "derive, don't declare" exists.
 *
 * 🎯 Delete both hand-written object types and derive them from the table
 *    with `typeof habits.$inferSelect` / `typeof habits.$inferInsert`.
 *    Don't touch the table — it is the source of truth.
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

// ❌ hand-maintained copies — already out of sync with the table above
export type Habit = {
  id: number;
  name: string;
  cadence: string;
  target: number;
  notes: string;
};

export type NewHabit = {
  id: number;
  name: string;
  cadence: string;
  target: number;
  notes: string;
};

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
