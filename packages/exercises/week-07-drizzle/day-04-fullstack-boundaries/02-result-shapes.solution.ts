/**
 * Exercise 02 — Result shapes: discriminate, don't guess (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

export const draftSchema = z.object({
  title: z.string().min(1),
  body: z.string(),
  tags: z.array(z.string()),
});

export type Draft = z.infer<typeof draftSchema>;

// One tag, two arms — `if (result.ok)` narrows to exactly one of them.
export type ValidationResult =
  | { ok: true; value: Draft }
  | { ok: false; errors: string[] };

export const validateDraft = (input: unknown): ValidationResult => {
  const parsed = draftSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, value: parsed.data };
  }
  return {
    ok: false,
    errors: parsed.error.issues.map((issue) => issue.message),
  };
};

// --- tests ------------------------------------------------------------------

it("success narrows to the value arm", () => {
  const result = validateDraft({ title: "Day 4", body: "…", tags: ["ts"] });
  expect(result.ok).toBe(true);
  if (result.ok) {
    expectTypeOf(result.value).toEqualTypeOf<Draft>();
    expect(result.value.title).toBe("Day 4");
  }
});

it("failure narrows to the errors arm", () => {
  const result = validateDraft({ title: "" });
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expectTypeOf(result.errors).toEqualTypeOf<string[]>();
    expect(result.errors.length).toBeGreaterThan(0);
  }
});

it("the two arms are mutually exclusive", () => {
  expectTypeOf<ValidationResult>().toEqualTypeOf<
    { ok: true; value: Draft } | { ok: false; errors: string[] }
  >();
});
