/**
 * Exercise 03 — Narrowing with typeof (solution)
 *
 * Each `typeof` check handles one member and removes it from the union.
 * After the number and string branches return, `price` can only be a
 * boolean — TypeScript knows this without another check.
 */
import { expect, expectTypeOf, it } from "vitest";

const toCents = (price: number | string | boolean): number => {
  if (typeof price === "number") {
    return Math.round(price * 100);
  }
  if (typeof price === "string") {
    return Math.round(Number.parseFloat(price.replace("$", "")) * 100);
  }
  // Only boolean is left — the legacy "is free" flag.
  return 0;
};

// --- tests ------------------------------------------------------------------

it("converts dollar numbers to cents", () => {
  expect(toCents(19.99)).toBe(1999);
  expect(toCents(0.1)).toBe(10);
});

it("parses dollar strings", () => {
  expect(toCents("$19.99")).toBe(1999);
  expect(toCents("5")).toBe(500);
});

it("treats the legacy boolean flag as free", () => {
  expect(toCents(true)).toBe(0);
  expect(toCents(false)).toBe(0);
});

it("has the correct types", () => {
  expectTypeOf(toCents).toEqualTypeOf<
    (price: number | string | boolean) => number
  >();
});
