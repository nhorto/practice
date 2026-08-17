/**
 * Exercise 03 — Shape the insert type from the schema side (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  visibility: text("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
  attendees: integer("attendees").notNull().default(0),
  venue: text("venue"),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

// --- tests ------------------------------------------------------------------

it("defaults are recorded on the schema object", () => {
  expect(events.title.notNull).toBe(true);
  expect(events.visibility.hasDefault).toBe(true);
  expect(events.visibility.default).toBe("private");
  expect(events.attendees.hasDefault).toBe(true);
  expect(events.attendees.default).toBe(0);
  expect(events.venue.notNull).toBe(false);
});

it("the select type is fully resolved — defaults are always present", () => {
  expectTypeOf<Event>().toEqualTypeOf<{
    id: number;
    title: string;
    visibility: "public" | "private";
    attendees: number;
    venue: string | null;
  }>();
});

it("the insert type only requires what the db cannot supply", () => {
  expectTypeOf<NewEvent>().toEqualTypeOf<{
    id?: number;
    title: string;
    visibility?: "public" | "private";
    attendees?: number;
    venue?: string | null;
  }>();
});

it("a title alone is a valid insert", () => {
  const draft: NewEvent = { title: "TS meetup" };
  expect(draft.title).toBe("TS meetup");
});
