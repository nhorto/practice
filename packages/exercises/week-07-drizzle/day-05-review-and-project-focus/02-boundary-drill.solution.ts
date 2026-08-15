/**
 * Drill 02 — The boundary, from memory (solution)
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

export const subscriberInput = z.object({
  email: z.email(),
  plan: z.enum(["free", "pro"]).optional(),
});

export type SubscriberResult =
  | { ok: true; value: z.infer<typeof subscriberInput> }
  | { ok: false; errors: string[] };

export const validateSubscriber = (input: unknown): SubscriberResult => {
  const parsed = subscriberInput.safeParse(input);
  if (parsed.success) {
    return { ok: true, value: parsed.data };
  }
  return {
    ok: false,
    errors: parsed.error.issues.map((issue) => issue.message),
  };
};

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
