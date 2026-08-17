/**
 * Exercise 04 — Result helpers: `unwrapOr` and `mapResult` (solution)
 *
 * `unwrapOr` needs two type parameters; `mapResult` needs three — the input
 * success type, the output success type, and the error type that rides along
 * unchanged. Note how the error branch is returned as-is: it already IS a
 * valid `Result<U, E>`.
 */
import { expect, expectTypeOf, it } from "vitest";

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

const parseAge = (input: string): Result<number, string> => {
  const age = Number(input);
  return Number.isInteger(age) && age >= 0 ? ok(age) : err(`Not an age: ${input}`);
};

const unwrapOr = <T, E>(result: Result<T, E>, fallback: T): T =>
  result.ok ? result.value : fallback;

const mapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => (result.ok ? ok(fn(result.value)) : result);

// --- tests ------------------------------------------------------------------

it("unwraps a success value", () => {
  expect(unwrapOr(parseAge("42"), 0)).toBe(42);
});

it("falls back on failure", () => {
  expect(unwrapOr(parseAge("banana"), 0)).toBe(0);
});

it("maps success values", () => {
  expect(mapResult(parseAge("21"), (age: number) => age >= 18)).toEqual({
    ok: true,
    value: true,
  });
});

it("passes errors through untouched", () => {
  expect(mapResult(parseAge("banana"), (age: number) => age >= 18)).toEqual({
    ok: false,
    error: "Not an age: banana",
  });
});

it("has the correct types", () => {
  expectTypeOf(unwrapOr(parseAge("1"), 0)).toEqualTypeOf<number>();
  const mapped = mapResult(parseAge("1"), (age: number) => `${age} years`);
  expectTypeOf(mapped).toEqualTypeOf<Result<string, string>>();
});
