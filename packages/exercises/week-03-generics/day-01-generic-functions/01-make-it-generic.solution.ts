/**
 * Exercise 01 — Make it generic (solution)
 *
 * A type parameter is declared once in `<...>` and then used like any other
 * type. TypeScript infers it from the arguments: `firstOf([1, 2, 3])` makes
 * `T` = `number`, so the return type is `number | undefined`.
 */
import { expect, expectTypeOf, it } from "vitest";

const firstOf = <T>(items: T[]) => items[0];

const lastOf = <T>(items: T[]) => items[items.length - 1];

// Two type parameters — each position keeps its own type.
const pairOf = <A, B>(a: A, b: B): [A, B] => [a, b];

// --- tests ------------------------------------------------------------------

it("returns the first element of any array", () => {
  expect(firstOf([1, 2, 3])).toBe(1);
  expect(firstOf(["a", "b"])).toBe("a");
  expect(firstOf([] as string[])).toBeUndefined();
});

it("returns the last element of any array", () => {
  expect(lastOf([1, 2, 3])).toBe(3);
  expect(lastOf(["x", "y"])).toBe("y");
});

it("pairs two values of different types", () => {
  expect(pairOf("id", 42)).toEqual(["id", 42]);
});

it("has the correct types", () => {
  // `| undefined` comes from noUncheckedIndexedAccess — the array could be empty.
  expectTypeOf(firstOf([1, 2, 3])).toEqualTypeOf<number | undefined>();
  expectTypeOf(lastOf(["a", "b"])).toEqualTypeOf<string | undefined>();
  expectTypeOf(pairOf("id", 42)).toEqualTypeOf<[string, number]>();
});
