/**
 * Exercise 04 — Parsing unknown input (solution)
 *
 * Narrow `unknown` with typeof, then funnel both number-ish paths through
 * one validation. The discriminated ParseResult means callers can't touch
 * `value` without checking `ok` first — errors can't be ignored by accident.
 */
import { expect, expectTypeOf, it } from "vitest";

export type ParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

const parseQuantity = (input: unknown): ParseResult => {
  if (typeof input !== "number" && typeof input !== "string") {
    return { ok: false, error: "expected a number" };
  }

  const value = typeof input === "number" ? input : Number.parseFloat(input);

  if (!Number.isInteger(value) || value < 0) {
    return { ok: false, error: "not a whole number" };
  }

  return { ok: true, value };
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
