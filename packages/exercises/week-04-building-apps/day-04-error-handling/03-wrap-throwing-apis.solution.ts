/**
 * Exercise 03 — Wrapping throwing APIs (solution)
 *
 * The try/catch lives in exactly one place — the wrapper. Everything
 * downstream works with honest types: `Result` for the throw, `unknown` for
 * the `any`, and step-by-step narrowing before the value is trusted.
 */
import { expect, expectTypeOf, it } from "vitest";

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

const safeJsonParse = (text: string): Result<unknown, SyntaxError> => {
  try {
    // JSON.parse returns `any`; quarantine it as `unknown` immediately.
    return ok(JSON.parse(text) as unknown);
  } catch (error) {
    // `catch` variables are `unknown` under strict mode — narrow them too.
    return error instanceof SyntaxError
      ? err(error)
      : err(new SyntaxError(String(error)));
  }
};

const readCount = (text: string, fallback: number): number => {
  const result = safeJsonParse(text);
  if (!result.ok) {
    return fallback;
  }
  const data = result.value;
  if (
    typeof data === "object" &&
    data !== null &&
    "count" in data &&
    typeof data.count === "number"
  ) {
    return data.count;
  }
  return fallback;
};

// --- tests ------------------------------------------------------------------

it("parses valid JSON", () => {
  expect(safeJsonParse('{"a":1}')).toEqual({ ok: true, value: { a: 1 } });
});

it("captures the SyntaxError instead of throwing", () => {
  const result = safeJsonParse("{oops");
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.error).toBeInstanceOf(SyntaxError);
  }
});

it("reads a count, falling back on any failure", () => {
  expect(readCount('{"count": 3}', 0)).toBe(3);
  expect(readCount("not json", 7)).toBe(7);
  expect(readCount('{"count": "many"}', 7)).toBe(7);
  expect(readCount("null", 7)).toBe(7);
});

it("has the correct types", () => {
  expectTypeOf(safeJsonParse).returns.toEqualTypeOf<Result<unknown, SyntaxError>>();
  expectTypeOf(readCount).toEqualTypeOf<(text: string, fallback: number) => number>();
});
