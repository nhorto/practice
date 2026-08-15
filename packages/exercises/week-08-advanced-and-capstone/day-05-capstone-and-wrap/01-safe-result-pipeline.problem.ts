/**
 * Exercise 01 — Safe result pipeline (synthesis drill)
 *
 * Generics + Zod + discriminated unions in one pipeline: parse unknown data
 * into a `Result` that either carries typed data or carries the issues —
 * never a bag of maybes — and consume it exhaustively.
 *
 * 🎯 1. Redesign `Result<T>` as a discriminated union on `ok`:
 *       `{ ok: true; data: T } | { ok: false; issues: string[] }`.
 *    2. Make `safeParseWith` generic: given a `z.ZodType<T>` it returns a
 *       `Result<T>` (use the schema's `.safeParse`, and map
 *       `error.issues[n].message` into the issues array).
 *    3. Complete `describeOutcome` with an exhaustive switch on `result.ok`
 *       (yes, a boolean discriminant — `never` default included).
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

type Result<T> = {
  ok: boolean;
  data?: T;
  issues?: string[];
};

const safeParseWith = (schema: z.ZodType, raw: unknown): Result<unknown> => {
  const parsed = schema.safeParse(raw);
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }
  return { ok: false, issues: parsed.error.issues.map((issue) => issue.message) };
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled result: ${JSON.stringify(value)}`);
};

const describeOutcome = <T>(
  result: Result<T>,
  render: (data: T) => string,
): string => {
  // TODO: switch on `result.ok` — render successes, join issues with "; "
  // after a "Failed: " prefix, and assertNever in the default.
  return assertNever(result);
};

// --- tests ------------------------------------------------------------------

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

it("wraps successful parses with typed data", () => {
  const result = safeParseWith(messageSchema, { role: "user", content: "hi" });
  expect(result).toEqual({ ok: true, data: { role: "user", content: "hi" } });
  if (result.ok) {
    expectTypeOf(result.data).toEqualTypeOf<{
      role: "user" | "assistant";
      content: string;
    }>();
    // @ts-expect-error issues only exists on failures
    result.issues;
  }
});

it("collects issues on failure", () => {
  const result = safeParseWith(messageSchema, { role: "wizard", content: "" });
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.issues.length).toBeGreaterThan(0);
    // @ts-expect-error data only exists on successes
    result.data;
  }
});

it("renders outcomes exhaustively", () => {
  const good = safeParseWith(messageSchema, { role: "assistant", content: "4" });
  expect(describeOutcome(good, (m) => `${m.role}: ${m.content}`)).toBe(
    "assistant: 4",
  );
  const bad = safeParseWith(messageSchema, 42);
  expect(describeOutcome(bad, (m) => m.content)).toMatch(/^Failed: /);
});
