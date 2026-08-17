/**
 * Exercise 01 — Safe result pipeline (solution)
 *
 * Every piece is a course callback:
 *
 * - `Result<T>` is a GENERIC discriminated union. `ok: true` proves `data`
 *   exists (typed T, no optional); `ok: false` proves `issues` exists. The
 *   old "bag of maybes" made every consumer null-check both fields forever.
 * - `safeParseWith<T>(schema: z.ZodType<T>, ...)` — the type parameter
 *   relates the schema to the result: whatever the schema outputs is what a
 *   success carries. `z.infer` never has to be written by the caller.
 * - `describeOutcome` switches on a BOOLEAN discriminant — `case true`
 *   narrows to the success variant just like a string literal would, and the
 *   `default` still gets `never` once both cases are handled. Exhaustiveness
 *   isn't a switch-on-strings trick; it works on any literal discriminant.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; issues: string[] };

const safeParseWith = <T>(schema: z.ZodType<T>, raw: unknown): Result<T> => {
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
  switch (result.ok) {
    case true:
      return render(result.data);
    case false:
      return `Failed: ${result.issues.join("; ")}`;
    default:
      return assertNever(result);
  }
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
