/**
 * Exercise 01 — Make it generic
 *
 * These helpers work — but only for strings. A type parameter (`<T>`) lets one
 * function work for ANY element type while still remembering which type it
 * was: pass in numbers, get numbers back.
 *
 * 🎯 Replace the hardcoded `string` types with type parameters so every test
 *    and type check passes. Don't change the function bodies.
 */
import { expect, expectTypeOf, it } from "vitest";

const firstOf = (items: string[]) => items[0];

const lastOf = (items: string[]) => items[items.length - 1];

// `pairOf` should accept two DIFFERENT types and remember each position.
const pairOf = (a: string, b: string): [string, string] => [a, b];

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
