/**
 * Exercise 01 — Function annotations (solution)
 *
 * Parameters always need annotations. Return types are usually inferred, but
 * an explicit return type (like on `toPercent`) locks in the contract.
 */
import { expect, expectTypeOf, it } from "vitest";

const add = (a: number, b: number) => a + b;

const repeat = (text: string, times: number) => text.repeat(times);

const toPercent = (value: number): string => `${Math.round(value * 100)}%`;

// --- tests ------------------------------------------------------------------

it("adds two numbers", () => {
  expect(add(2, 3)).toBe(5);
});

it("repeats a string", () => {
  expect(repeat("ab", 3)).toBe("ababab");
});

it("formats a percentage", () => {
  expect(toPercent(0.421)).toBe("42%");
});

it("has the correct types", () => {
  expectTypeOf(add).toEqualTypeOf<(a: number, b: number) => number>();
  expectTypeOf(repeat).toEqualTypeOf<(text: string, times: number) => string>();
  expectTypeOf(toPercent).toEqualTypeOf<(value: number) => string>();
});
