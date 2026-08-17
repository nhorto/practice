/**
 * Exercise 01 — A Zod schema that mirrors the table
 *
 * The table's `$inferInsert` says what the database needs; the Zod schema
 * says what the outside world may send. They must line up: every parsed
 * input has to be a valid insert. The current draft was written without
 * looking at the table — every field is a required `z.string()`, so a
 * perfectly good RSVP gets rejected and a parsed one wouldn't insert.
 *
 * 🎯 Rewrite `rsvpInput` so that:
 *    - `name` is a non-empty string (required)
 *    - `guests` is an optional integer (the column has a default)
 *    - `diet` is optional and only the enum's values (z.enum)
 *    - `note` is optional AND nullable (the column is nullable)
 *    The `toInsertRow` line below is the handshake: it must compile.
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

// ❌ written without looking at the table
export const rsvpInput = z.object({
  name: z.string(),
  guests: z.string(),
  diet: z.string(),
  note: z.string(),
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
