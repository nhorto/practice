/**
 * Exercise 01 — A `Result` type that narrows (solution)
 *
 * `ok` is the discriminant: `true` pairs with `value`, `false` pairs with
 * `error`, and no state can carry both or neither. One `if (result.ok)`
 * gives the compiler everything it needs.
 */
import { expect, expectTypeOf, it } from "vitest";

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

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
