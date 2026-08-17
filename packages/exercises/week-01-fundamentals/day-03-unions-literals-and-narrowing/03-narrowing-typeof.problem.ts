/**
 * Exercise 03 — Narrowing with typeof
 *
 * TypeScript watches your runtime `typeof` checks and shrinks the union in
 * each branch. Inside `if (typeof value === "string")`, the value IS a
 * string — `.trim()`, `.toUpperCase()` and friends all light up.
 *
 * 🎯 Implement `toCents`. The price can arrive as:
 *      - a number  → dollars; return it in cents (`19.99` → `1999`, rounded)
 *      - a string  → like "$19.99" or "19.99"; strip any "$", parse with
 *                    `Number.parseFloat`, then convert like the number case
 *      - a boolean → a legacy "is free" flag; return `0`
 *    Use one `typeof` check per branch. Hover `price` in each branch and
 *    watch the union shrink.
 */
import { expect, expectTypeOf, it } from "vitest";

const toCents = (price: number | string | boolean): number => {
  // TODO: narrow with typeof, one branch per member of the union.
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
