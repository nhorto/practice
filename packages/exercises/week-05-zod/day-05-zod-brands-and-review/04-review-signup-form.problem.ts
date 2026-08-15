/**
 * Exercise 04 — Review drill: a signup form
 *
 * Browser form data is all strings, arrives messy, and has cross-field
 * rules — one schema handles the whole intake: normalize, coerce, default,
 * refine, and hand back honest types on both ends.
 *
 * 🎯 Rebuild `SignupFormSchema` so that:
 *      - email:    trimmed + lowercased via .transform, then .pipe(z.email())
 *      - age:      z.coerce.number(), int, min 13
 *      - plan:     "free" | "pro", default "free"
 *      - password: string, min 8   ·   confirm: string
 *      - a .refine checks password === confirm with the error
 *        "passwords must match"
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: this naive version trusts pre-cleaned, pre-typed data — real form
//       data is stringly and messy. Rebuild it per the header.
const SignupFormSchema = z.object({
  email: z.email(),
  age: z.number(),
  plan: z.enum(["free", "pro"]),
  password: z.string().min(8),
  confirm: z.string(),
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
