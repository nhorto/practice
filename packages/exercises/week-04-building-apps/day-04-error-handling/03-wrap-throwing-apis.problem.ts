/**
 * Exercise 03 — Wrapping throwing APIs
 *
 * `JSON.parse` is the worst of both worlds: it THROWS on bad input (invisible
 * in the types) and returns `any` on good input (poisons everything after).
 * The fix is a wrapper that catches the throw into a `Result` and quarantines
 * the `any` as `unknown` — so callers must handle failure AND narrow the
 * value before using it.
 *
 * 🎯 1. `safeJsonParse` — catch the `SyntaxError` and return it with `err`
 *       instead of letting it fly.
 *    2. `readCount` — narrow: bail to `fallback` unless the result is ok AND
 *       the value is an object with a numeric `count` property. (`typeof`,
 *       `!== null`, and the `in` operator get you there.)
 */
import { expect, expectTypeOf, it } from "vitest";

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// TODO: never throw — catch and return err(...) instead.
const safeJsonParse = (text: string): Result<unknown, SyntaxError> => {
  // JSON.parse returns `any`; quarantine it as `unknown` immediately.
  return ok(JSON.parse(text) as unknown);
};

// TODO: use safeJsonParse, then narrow the unknown value down to
// { count: number } before trusting it.
const readCount = (text: string, fallback: number): number => {
  const result = safeJsonParse(text);
  return result.value.count;
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
