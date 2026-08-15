/**
 * Exercise 03 — .extend() and unknown-key policy
 *
 * Two composition tools today:
 *   - `.extend({ ... })` builds a bigger object schema from a base one
 *     (v4 removed `.merge()` — extend with another schema's `.shape` instead).
 *   - The unknown-key policy: `z.object` STRIPS keys it doesn't know,
 *     `z.strictObject` REJECTS them, `z.looseObject` KEEPS them.
 *
 * 🎯 Three TODOs:
 *      1. Build `EmployeeSchema` from `PersonSchema.extend(...)`, adding
 *         role: "engineer" | "designer" | "manager" (use z.enum).
 *      2. Make `StrictSettingsSchema` reject unknown keys.
 *      3. Make `LooseSettingsSchema` keep unknown keys.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const PersonSchema = z.object({
  name: z.string(),
  email: z.email(),
});

// TODO: extend PersonSchema with a `role` enum field.
const EmployeeSchema = PersonSchema;

// z.object strips unknown keys — this one is our baseline.
const SettingsSchema = z.object({ theme: z.string() });

// TODO: same shape, but unknown keys are an error.
const StrictSettingsSchema = z.object({ theme: z.string() });

// TODO: same shape, but unknown keys pass through into the output.
const LooseSettingsSchema = z.object({ theme: z.string() });

type Employee = z.infer<typeof EmployeeSchema>;

// --- tests ------------------------------------------------------------------

it("extends the person schema with a role", () => {
  expect(
    EmployeeSchema.parse({
      name: "Grace",
      email: "grace@example.com",
      role: "engineer",
    }),
  ).toEqual({ name: "Grace", email: "grace@example.com", role: "engineer" });
  expect(
    EmployeeSchema.safeParse({
      name: "Grace",
      email: "grace@example.com",
      role: "astronaut",
    }).success,
  ).toBe(false);
  expectTypeOf<Employee>().toEqualTypeOf<{
    name: string;
    email: string;
    role: "engineer" | "designer" | "manager";
  }>();
});

it("z.object strips unknown keys (the default)", () => {
  expect(SettingsSchema.parse({ theme: "dark", legacyFlag: true })).toEqual({
    theme: "dark",
  });
});

it("z.strictObject rejects unknown keys", () => {
  expect(StrictSettingsSchema.parse({ theme: "dark" })).toEqual({
    theme: "dark",
  });
  expect(
    StrictSettingsSchema.safeParse({ theme: "dark", legacyFlag: true }).success,
  ).toBe(false);
});

it("z.looseObject keeps unknown keys", () => {
  expect(LooseSettingsSchema.parse({ theme: "dark", legacyFlag: true })).toEqual(
    { theme: "dark", legacyFlag: true },
  );
});
