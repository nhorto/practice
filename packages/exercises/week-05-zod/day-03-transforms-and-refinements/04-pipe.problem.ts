/**
 * Exercise 04 — .pipe()
 *
 * `.pipe(next)` feeds one schema's output into another schema: validate →
 * transform → validate the RESULT again. Without the second stage, a
 * transform's output is whatever the function returns — nothing re-checks it.
 *
 * 🎯 Two pipelines:
 *      - NormalizedEmailSchema: trim + lowercase a string, then pipe into
 *        z.email() so the CLEANED value is what gets validated
 *        ("  Ada@Example.COM " should pass).
 *      - AnswerCountSchema: z.coerce.number() piped into an int 0..1000
 *        check.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: normalize first, then validate the normalized value as an email.
const NormalizedEmailSchema = z.email();

// TODO: coerce to number, then pipe into int().min(0).max(1000).
const AnswerCountSchema = z.coerce.number();

// --- tests ------------------------------------------------------------------

it("validates the email AFTER normalizing", () => {
  expect(NormalizedEmailSchema.parse("  Ada@Example.COM ")).toBe(
    "ada@example.com",
  );
  expect(NormalizedEmailSchema.parse("grace@example.com")).toBe(
    "grace@example.com",
  );
  expect(NormalizedEmailSchema.safeParse("not an email").success).toBe(false);
});

it("re-validates the coerced number", () => {
  expect(AnswerCountSchema.parse("42")).toBe(42);
  expect(AnswerCountSchema.parse(7)).toBe(7);
  expect(AnswerCountSchema.safeParse("42.5").success).toBe(false);
  expect(AnswerCountSchema.safeParse("-1").success).toBe(false);
  expect(AnswerCountSchema.safeParse("9001").success).toBe(false);
});

it("pipelines keep honest input/output types", () => {
  expectTypeOf<z.input<typeof NormalizedEmailSchema>>().toEqualTypeOf<string>();
  expectTypeOf<z.output<typeof NormalizedEmailSchema>>().toEqualTypeOf<string>();
  expectTypeOf<z.output<typeof AnswerCountSchema>>().toEqualTypeOf<number>();
});
