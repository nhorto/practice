/**
 * Exercise 01 — A Zod schema that mirrors the table (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const rsvps = sqliteTable("rsvps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  guests: integer("guests").notNull().default(1),
  diet: text("diet", { enum: ["none", "vegetarian", "vegan"] })
    .notNull()
    .default("none"),
  note: text("note"),
});

export type NewRsvp = typeof rsvps.$inferInsert;

// Written *from* the table: required where the db has no default, optional
// where it does, nullable where the column is nullable.
export const rsvpInput = z.object({
  name: z.string().min(1),
  guests: z.number().int().optional(),
  diet: z.enum(["none", "vegetarian", "vegan"]).optional(),
  note: z.string().nullable().optional(),
});

// The handshake: anything the schema outputs is a valid insert row.
export const toInsertRow = (data: z.infer<typeof rsvpInput>): NewRsvp => data;

// --- tests ------------------------------------------------------------------

it("accepts a minimal RSVP — the table fills in the rest", () => {
  const parsed = rsvpInput.safeParse({ name: "Ada" });
  expect(parsed.success).toBe(true);
});

it("accepts a full RSVP, including a null note", () => {
  const parsed = rsvpInput.safeParse({
    name: "Grace",
    guests: 2,
    diet: "vegan",
    note: null,
  });
  expect(parsed.success).toBe(true);
});

it("rejects an empty name and an unknown diet", () => {
  expect(rsvpInput.safeParse({ name: "" }).success).toBe(false);
  expect(
    rsvpInput.safeParse({ name: "Joan", diet: "carnivore" }).success,
  ).toBe(false);
});

it("the schema's output type lines up with the insert type", () => {
  expectTypeOf<z.infer<typeof rsvpInput>>().toEqualTypeOf<{
    name: string;
    guests?: number;
    diet?: "none" | "vegetarian" | "vegan";
    note?: string | null;
  }>();
  expectTypeOf<z.infer<typeof rsvpInput>>().toExtend<NewRsvp>();
});
