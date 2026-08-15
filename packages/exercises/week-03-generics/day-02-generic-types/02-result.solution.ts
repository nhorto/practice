/**
 * Exercise 02 — Result<T, E> (solution)
 *
 * The discriminated union makes `ok` mean something: checking it narrows the
 * whole object, so the success arm HAS a `value: T` and the failure arm HAS
 * an `error: E`. Two type parameters let each use pick its own payloads —
 * here `Result<number, string>`.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const parseAge = (input: string): Result<number, string> => {
  const age = Number(input);
  if (Number.isNaN(age)) {
    return { ok: false, error: `not a number: "${input}"` };
  }
  if (age < 0) {
    return { ok: false, error: "age cannot be negative" };
  }
  return { ok: true, value: age };
};

const unwrapOr = <T, E>(result: Result<T, E>, fallback: T): T =>
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
