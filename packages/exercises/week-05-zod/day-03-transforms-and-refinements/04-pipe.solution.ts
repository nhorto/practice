/**
 * Exercise 04 — .pipe() (solution)
 *
 * Stage one cleans, stage two enforces. The email check sees the trimmed,
 * lowercased value; the range check sees the coerced number. Each stage's
 * output type must match the next stage's input type — the compiler checks
 * the plumbing.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const NormalizedEmailSchema = z
  .string()
  .transform((raw) => raw.trim().toLowerCase())
  .pipe(z.email());

const AnswerCountSchema = z.coerce.number().pipe(
  z.number().int().min(0).max(1000),
);

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
