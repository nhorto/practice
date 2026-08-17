/**
 * Exercise 02 — .refine() (solution)
 *
 * The refinement function receives the already-shape-checked value, so it
 * can safely read both fields. `{ error: "..." }` is v4's single way to
 * customize the message.
 */
import { expect, it } from "vitest";
import { z } from "zod";

const SignupSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((signup) => signup.password === signup.confirm, {
    error: "passwords must match",
  });

const BookingSchema = z
  .object({
    room: z.string(),
    start: z.number(),
    end: z.number(),
  })
  .refine((booking) => booking.end > booking.start, {
    error: "end must be after start",
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
