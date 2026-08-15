/**
 * Exercise 01 — Function annotations
 *
 * TypeScript cannot infer parameter types — they're the one place annotations
 * are ALWAYS required. Under `strict` mode, unannotated parameters are
 * implicit `any` errors.
 *
 * 🎯 Add type annotations to the functions below until every test and type
 *    check passes. Don't change the function bodies.
 */
import { expect, expectTypeOf, it } from "vitest";

const add = (a, b) => a + b;

const repeat = (text, times) => text.repeat(times);

// A return type annotation locks in the contract: annotate `toPercent` so it
// is GUARANTEED to return a string, even if someone edits the body later.
const toPercent = (value) => `${Math.round(value * 100)}%`;

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
