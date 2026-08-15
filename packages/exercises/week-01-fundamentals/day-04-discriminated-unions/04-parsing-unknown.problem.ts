/**
 * Exercise 04 — Parsing unknown input
 *
 * Data from the outside world (JSON.parse, form fields, query params) is
 * `unknown`. The professional move: narrow it step by step and return a
 * discriminated RESULT type instead of throwing — the caller then narrows
 * on `ok` to find out what happened.
 *
 * 🎯 Implement `parseQuantity`. Rules:
 *      - a number        → ok, if it's a non-negative integer
 *                          (Number.isInteger, >= 0); otherwise the error
 *                          "not a whole number"
 *      - a string        → Number.parseFloat it, then apply the same rule
 *      - anything else   → the error "expected a number"
 *    Return { ok: true, value } or { ok: false, error }.
 */
import { expect, expectTypeOf, it } from "vitest";

export type ParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

const parseQuantity = (input: unknown): ParseResult => {
  // TODO: typeof-narrow `input`, validate, and wrap in a ParseResult.
};

// --- tests ------------------------------------------------------------------

it("accepts whole non-negative numbers", () => {
  expect(parseQuantity(3)).toEqual({ ok: true, value: 3 });
  expect(parseQuantity(0)).toEqual({ ok: true, value: 0 });
  expect(parseQuantity("12")).toEqual({ ok: true, value: 12 });
});

it("rejects fractions and negatives", () => {
  expect(parseQuantity(2.5)).toEqual({ ok: false, error: "not a whole number" });
  expect(parseQuantity(-1)).toEqual({ ok: false, error: "not a whole number" });
  expect(parseQuantity("2.5")).toEqual({
    ok: false,
    error: "not a whole number",
  });
});

it("rejects everything that isn't number-ish", () => {
  expect(parseQuantity(null)).toEqual({ ok: false, error: "expected a number" });
  expect(parseQuantity("abc")).toEqual({
    ok: false,
    error: "not a whole number",
  });
  expect(parseQuantity({ qty: 3 })).toEqual({
    ok: false,
    error: "expected a number",
  });
});

it("has the correct types", () => {
  expectTypeOf(parseQuantity).toEqualTypeOf<(input: unknown) => ParseResult>();

  // The result is discriminated on `ok` — narrowing works for callers:
  const result = parseQuantity(3);
  if (result.ok) {
    expectTypeOf(result.value).toEqualTypeOf<number>();
  } else {
    expectTypeOf(result.error).toEqualTypeOf<string>();
  }
});
