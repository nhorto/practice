/**
 * Exercise 04 — Result helpers: `unwrapOr` and `mapResult`
 *
 * Once results flow through your code, two helpers do most of the work:
 * `unwrapOr` exits Result-land with a fallback, and `mapResult` transforms a
 * success value while letting errors pass through untouched. Both are
 * generic — you design the signatures.
 *
 * 🎯 Annotate and implement both helpers:
 *    - `unwrapOr(result, fallback)` returns the success value, or `fallback`
 *      for an error. The fallback has the same type as the success value.
 *    - `mapResult(result, fn)` applies `fn` to the success value, producing
 *      a `Result` with a new success type and the SAME error type.
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

// TODO: add generics + annotations, then implement.
const unwrapOr = (result, fallback) => {
  throw new Error("TODO");
};

// TODO: add generics + annotations, then implement.
const mapResult = (result, fn) => {
  throw new Error("TODO");
};

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
