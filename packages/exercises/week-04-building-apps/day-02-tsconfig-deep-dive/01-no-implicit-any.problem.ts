/**
 * Exercise 01 — What `noImplicitAny` catches
 *
 * Without `noImplicitAny` (part of `strict`), every unannotated parameter is
 * silently `any` — a hole in the type system that spreads to everything it
 * touches. With it on, the compiler makes you say what you mean. Note where
 * it hides: not just plain parameters, but callback parameters and
 * destructured ones too.
 *
 * 🎯 Add type annotations until every implicit `any` is gone. The `format`
 *    parameter needs a full function type; `describeOrder` destructures its
 *    parameter, so the annotation goes after the pattern.
 */
import { expect, expectTypeOf, it } from "vitest";

const applyDiscount = (price, percent) => price * (1 - percent / 100);

const formatPrices = (prices, format) => prices.map(format);

const describeOrder = ({ id, total }) => `#${id}: $${total.toFixed(2)}`;

// --- tests ------------------------------------------------------------------

it("applies a percentage discount", () => {
  expect(applyDiscount(200, 25)).toBe(150);
});

it("formats every price", () => {
  expect(formatPrices([9.5, 20], (price: number) => `$${price.toFixed(2)}`)).toEqual([
    "$9.50",
    "$20.00",
  ]);
});

it("describes an order", () => {
  expect(describeOrder({ id: "A-7", total: 12.5 })).toBe("#A-7: $12.50");
});

it("has the correct types", () => {
  expectTypeOf(applyDiscount).toEqualTypeOf<(price: number, percent: number) => number>();
  expectTypeOf(formatPrices).toEqualTypeOf<
    (prices: number[], format: (price: number) => string) => string[]
  >();
  expectTypeOf(describeOrder).parameter(0).toEqualTypeOf<{ id: string; total: number }>();
});
