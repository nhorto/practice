/**
 * Exercise 01 — A `Result` type that narrows
 *
 * A `Result<T, E>` makes failure part of a function's signature instead of
 * an invisible `throw`. But the shape below is the naive version: a boolean
 * flag with two optional fields. Checking `result.ok` proves *nothing* to
 * the compiler — `value` stays `T | undefined` forever.
 *
 * 🎯 Rewrite `Result<T, E>` as a discriminated union:
 *      { ok: true; value: T } | { ok: false; error: E }
 *    so that checking `.ok` narrows to exactly one branch. Don't change
 *    `ok`, `err`, or `divide` — their bodies already fit.
 */
import { expect, expectTypeOf, it } from "vitest";

type Result<T, E> = {
  ok: boolean;
  value?: T;
  error?: E;
};

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

const divide = (a: number, b: number): Result<number, string> =>
  b === 0 ? err("Cannot divide by zero") : ok(a / b);

// --- tests ------------------------------------------------------------------

it("narrows on success", () => {
  const result = divide(10, 2);
  if (result.ok) {
    expect(result.value).toBe(5);
    expectTypeOf(result.value).toEqualTypeOf<number>();
  } else {
    expect.unreachable("10 / 2 should succeed");
  }
});

it("narrows on failure", () => {
  const result = divide(1, 0);
  if (!result.ok) {
    expect(result.error).toBe("Cannot divide by zero");
    expectTypeOf(result.error).toEqualTypeOf<string>();
  } else {
    expect.unreachable("dividing by zero should fail");
  }
});

it("has the discriminated shape", () => {
  expectTypeOf(divide(1, 1)).toEqualTypeOf<
    { ok: true; value: number } | { ok: false; error: string }
  >();
});
