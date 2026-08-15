/**
 * Exercise 02 — .refine()
 *
 * Some rules no static type can express: "these two fields must match",
 * "the end date comes after the start". `.refine(fn, { error: "..." })`
 * attaches such a rule to a schema — note zod v4's unified `error` param
 * (the v3 `message` option is gone).
 *
 * 🎯 Two TODOs:
 *      - SignupSchema: refine so `password` and `confirm` match, with the
 *        error "passwords must match".
 *      - BookingSchema: refine so `end` is strictly after `start`, with the
 *        error "end must be after start".
 */
import { expect, it } from "vitest";
import { z } from "zod";

// TODO: add the cross-field refinement.
const SignupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  confirm: z.string(),
});

// TODO: add the range refinement.
const BookingSchema = z.object({
  room: z.string(),
  start: z.number(),
  end: z.number(),
});

// --- tests ------------------------------------------------------------------

it("accepts a signup with matching passwords", () => {
  expect(
    SignupSchema.safeParse({
      email: "ada@example.com",
      password: "correcthorse",
      confirm: "correcthorse",
    }).success,
  ).toBe(true);
});

it("rejects mismatched passwords with a readable error", () => {
  const result = SignupSchema.safeParse({
    email: "ada@example.com",
    password: "correcthorse",
    confirm: "correcthores",
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues.map((issue) => issue.message)).toContain(
      "passwords must match",
    );
  }
});

it("accepts a booking where end is after start", () => {
  expect(
    BookingSchema.safeParse({ room: "R1", start: 100, end: 200 }).success,
  ).toBe(true);
});

it("rejects a backwards booking with a readable error", () => {
  const result = BookingSchema.safeParse({ room: "R1", start: 200, end: 100 });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues.map((issue) => issue.message)).toContain(
      "end must be after start",
    );
  }
});

it("refinements run after the base shape checks", () => {
  // Bad shape first: the refinement never even runs.
  expect(
    SignupSchema.safeParse({ email: "nope", password: "x", confirm: "x" })
      .success,
  ).toBe(false);
});
