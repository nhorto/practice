/**
 * Exercise 02 — Result<T, E>
 *
 * This `Result` is a "bag of optionals": `ok` says nothing about which of
 * `value` / `error` actually exists, so narrowing on `result.ok` narrows
 * NOTHING. This is the anti-pattern from the reading.
 *
 * 🎯 Redesign `Result` as a generic discriminated union:
 *      - `{ ok: true; value: T }` — success carries a value, never an error
 *      - `{ ok: false; error: E }` — failure carries an error, never a value
 *    Then update `parseAge` and `unwrapOr` to use it. The bodies stay as
 *    they are — only signatures and the type change.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Result = {
  ok: boolean;
  value?: unknown;
  error?: unknown;
};

const parseAge = (input: string): Result => {
  const age = Number(input);
  if (Number.isNaN(age)) {
    return { ok: false, error: `not a number: "${input}"` };
  }
  if (age < 0) {
    return { ok: false, error: "age cannot be negative" };
  }
  return { ok: true, value: age };
};

const unwrapOr = (result: Result, fallback: unknown) =>
  result.ok ? result.value : fallback;

// --- tests ------------------------------------------------------------------

it("narrows on the ok discriminant", () => {
  const result = parseAge("42");
  if (result.ok) {
    expectTypeOf(result.value).toEqualTypeOf<number>();
    expect(result.value).toBe(42);
  } else {
    expectTypeOf(result.error).toEqualTypeOf<string>();
    throw new Error("expected parseAge('42') to be ok");
  }
});

it("carries an error message for bad input", () => {
  expect(parseAge("banana")).toEqual({ ok: false, error: 'not a number: "banana"' });
  expect(parseAge("-3")).toEqual({ ok: false, error: "age cannot be negative" });
});

it("unwraps with a fallback", () => {
  expect(unwrapOr(parseAge("30"), 0)).toBe(30);
  expect(unwrapOr(parseAge("nope"), 0)).toBe(0);
  expectTypeOf(unwrapOr(parseAge("30"), 0)).toEqualTypeOf<number>();
});
