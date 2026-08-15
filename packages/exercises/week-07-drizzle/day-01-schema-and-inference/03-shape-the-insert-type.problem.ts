/**
 * Exercise 03 — Shape the insert type from the schema side
 *
 * `$inferInsert` is not something you edit — it is a *consequence* of your
 * column modifiers. Want a field to be required on insert? `.notNull()` with
 * no default. Want callers to be able to omit it? Give it a `.default()`.
 * Want it genuinely optional data? Leave it nullable.
 *
 * 🎯 Adjust ONLY the column modifiers on `events` (not the tests, not the
 *    column names) until the insert type is:
 *      { id?: number; title: string; visibility?: "public" | "private";
 *        attendees?: number; venue?: string | null }
 *    `title` must be required; `visibility` defaults to "private";
 *    `attendees` defaults to 0; `venue` stays truly optional (nullable).
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  visibility: text("visibility", { enum: ["public", "private"] }),
  attendees: integer("attendees"),
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
