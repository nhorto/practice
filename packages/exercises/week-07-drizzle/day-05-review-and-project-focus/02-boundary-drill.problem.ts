/**
 * Drill 02 — The boundary, from memory
 *
 * A table, a Zod schema, a Result — the day-4 flow, condensed. The current
 * schema validates nothing and the "validator" returns a bare boolean,
 * throwing away both the parsed value and the error messages.
 *
 * 🎯 1. `subscriberInput`: `email` must be a real email (z.email());
 *       `plan` only the enum's values, optional (the column has a default).
 *    2. `validateSubscriber` returns a discriminated Result:
 *       `{ ok: true; value: <schema output> } | { ok: false; errors: string[] }`
 *       (annotate the return type — don't let a bare boolean escape).
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  plan: text("plan", { enum: ["free", "pro"] }).notNull().default("free"),
});

export type NewSubscriber = typeof subscribers.$inferInsert;

// ❌ validates nothing the table cares about
export const subscriberInput = z.object({
  email: z.string(),
  plan: z.string(),
});

// ❌ a boolean throws away the value AND the errors
export const validateSubscriber = (input: unknown) =>
  subscriberInput.safeParse(input).success;

// --- tests ------------------------------------------------------------------

it("a valid subscriber narrows to the value arm", () => {
  const result = validateSubscriber({ email: "sam@example.com" });
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.value.email).toBe("sam@example.com");
    expectTypeOf(result.value).toExtend<NewSubscriber>();
  }
});

it("a bad email narrows to the errors arm", () => {
  const result = validateSubscriber({ email: "not-an-email" });
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.errors.length).toBeGreaterThan(0);
    expectTypeOf(result.errors).toEqualTypeOf<string[]>();
  }
});

it("the schema and the return type line up with the table", () => {
  expectTypeOf<z.infer<typeof subscriberInput>>().toEqualTypeOf<{
    email: string;
    plan?: "free" | "pro";
  }>();
  expectTypeOf<ReturnType<typeof validateSubscriber>>().toEqualTypeOf<
    | { ok: true; value: { email: string; plan?: "free" | "pro" } }
    | { ok: false; errors: string[] }
  >();
});
