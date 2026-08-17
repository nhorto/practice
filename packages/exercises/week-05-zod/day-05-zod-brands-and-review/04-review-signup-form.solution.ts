/**
 * Exercise 04 — Review drill: a signup form (solution)
 *
 * The whole week in one schema: transform + pipe normalize then re-validate,
 * coerce absorbs stringly form data, default documents the fallback, refine
 * holds the cross-field rule, and z.input / z.output describe both ends —
 * derived, never hand-written.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const SignupFormSchema = z
  .object({
    email: z
      .string()
      .transform((raw) => raw.trim().toLowerCase())
      .pipe(z.email()),
    age: z.coerce.number().int().min(13),
    plan: z.enum(["free", "pro"]).default("free"),
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((form) => form.password === form.confirm, {
    error: "passwords must match",
  });

type SignupForm = z.output<typeof SignupFormSchema>;

// --- tests ------------------------------------------------------------------

it("parses a raw browser form", () => {
  expect(
    SignupFormSchema.parse({
      email: "  Ada@Example.COM ",
      age: "36",
      plan: "pro",
      password: "correcthorse",
      confirm: "correcthorse",
    }),
  ).toEqual({
    email: "ada@example.com",
    age: 36,
    plan: "pro",
    password: "correcthorse",
    confirm: "correcthorse",
  });
});

it("defaults the plan when the field is omitted", () => {
  const form = SignupFormSchema.parse({
    email: "grace@example.com",
    age: "45",
    password: "enigmamachine",
    confirm: "enigmamachine",
  });
  expect(form.plan).toBe("free");
});

it("rejects underage, mismatched, and malformed signups", () => {
  const valid = {
    email: "ada@example.com",
    age: "36",
    plan: "free",
    password: "correcthorse",
    confirm: "correcthorse",
  };
  expect(SignupFormSchema.safeParse({ ...valid, age: "12" }).success).toBe(false);
  expect(SignupFormSchema.safeParse({ ...valid, email: "nope" }).success).toBe(
    false,
  );
  const mismatched = SignupFormSchema.safeParse({ ...valid, confirm: "oops" });
  expect(mismatched.success).toBe(false);
  if (!mismatched.success) {
    expect(mismatched.error.issues.map((issue) => issue.message)).toContain(
      "passwords must match",
    );
  }
});

it("wire format in, clean types out", () => {
  expectTypeOf<z.input<typeof SignupFormSchema>>().toEqualTypeOf<{
    email: string;
    age: unknown;
    plan?: "free" | "pro" | undefined;
    password: string;
    confirm: string;
  }>();
  expectTypeOf<SignupForm>().toEqualTypeOf<{
    email: string;
    age: number;
    plan: "free" | "pro";
    password: string;
    confirm: string;
  }>();
});
