/**
 * Exercise 03 — The server-action flow, end to end (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";

export const feedback = sqliteTable("feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  message: text("message").notNull(),
  rating: integer("rating").notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;

export type Result<T, E> = { ok: true; value: T } | { ok: false; errors: E };

const schema = { feedback };
declare const db: BetterSQLite3Database<typeof schema>;

// Given: the data layer, one line, fully typed. Never called at runtime.
const insertFeedback = (row: NewFeedback) =>
  db.insert(feedback).values(row).returning().get();

// Coercion lives in the schema — the one place that knows the wire format.
export const feedbackInput = z.object({
  email: z.email(),
  message: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
});

export const submitFeedback = async (
  raw: unknown,
): Promise<Result<Feedback, string[]>> => {
  const parsed = feedbackInput.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }
  const row = insertFeedback(parsed.data);
  return { ok: true, value: row };
};

// --- tests ------------------------------------------------------------------

it("coerces FormData strings into a typed row", () => {
  const parsed = feedbackInput.safeParse({
    email: "mo@example.com",
    message: "Great set of exercises",
    rating: "5",
  });
  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.rating).toBe(5);
    expectTypeOf(parsed.data).toExtend<NewFeedback>();
  }
});

it("rejects a bad email, an empty message, and an out-of-range rating", () => {
  expect(
    feedbackInput.safeParse({ email: "nope", message: "hi", rating: "3" })
      .success,
  ).toBe(false);
  expect(
    feedbackInput.safeParse({ email: "a@b.co", message: "", rating: "3" })
      .success,
  ).toBe(false);
  expect(
    feedbackInput.safeParse({ email: "a@b.co", message: "hi", rating: "9" })
      .success,
  ).toBe(false);
});

it("the action takes unknown and returns a discriminated Result", () => {
  expectTypeOf(submitFeedback).parameter(0).toEqualTypeOf<unknown>();
  expectTypeOf<Awaited<ReturnType<typeof submitFeedback>>>().toEqualTypeOf<
    Result<Feedback, string[]>
  >();
});
