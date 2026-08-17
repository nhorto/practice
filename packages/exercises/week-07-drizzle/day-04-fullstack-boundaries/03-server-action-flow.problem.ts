/**
 * Exercise 03 — The server-action flow, end to end
 *
 * unknown → Zod (with coercion) → insert → Result. Two things are broken:
 *
 * 1. `feedbackInput` forgets that FormData delivers STRINGS — `rating`
 *    arrives as "5", so `z.number()` rejects every real submission, and the
 *    email field isn't validated at all.
 * 2. `submitFeedback` is a stub that leaks `unknown` straight through — the
 *    exact thing a boundary exists to prevent.
 *
 * NOTE: `db` is type-only. `insertFeedback` and `submitFeedback` are never
 * called at runtime — only the Zod schema is exercised live.
 *
 * 🎯 1. Fix the schema: `email` is a real email (z.email()), `message` is
 *       non-empty, `rating` coerces to an integer 1–5 (z.coerce).
 *    2. Implement `submitFeedback`: safeParse; on failure return
 *       `{ ok: false, errors: [...issue messages] }`; on success insert via
 *       `insertFeedback` and return `{ ok: true, value: row }`. Annotate the
 *       return type as `Promise<Result<Feedback, string[]>>`.
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

// ❌ 1. written for JSON, but FormData sends strings — and no real checks
export const feedbackInput = z.object({
  email: z.string(),
  message: z.string(),
  rating: z.number(),
});

// ❌ 2. stub — leaks `unknown` instead of returning a Result
export const submitFeedback = async (raw: unknown) => {
  return raw;
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
