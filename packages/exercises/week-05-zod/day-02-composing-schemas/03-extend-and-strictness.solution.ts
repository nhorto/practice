/**
 * Exercise 03 — .extend() and unknown-key policy (solution)
 *
 * strip (z.object) is the sensible boundary default; strict is for payloads
 * you fully control, where an extra key means someone made a mistake; loose
 * is for pass-through data you forward without caring what else is inside.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const PersonSchema = z.object({
  name: z.string(),
  email: z.email(),
});

const EmployeeSchema = PersonSchema.extend({
  role: z.enum(["engineer", "designer", "manager"]),
});

// z.object strips unknown keys — this one is our baseline.
const SettingsSchema = z.object({ theme: z.string() });

const StrictSettingsSchema = z.strictObject({ theme: z.string() });

const LooseSettingsSchema = z.looseObject({ theme: z.string() });

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
