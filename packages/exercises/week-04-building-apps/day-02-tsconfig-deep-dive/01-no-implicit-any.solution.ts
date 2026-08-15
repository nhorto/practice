/**
 * Exercise 01 — What `noImplicitAny` catches (solution)
 *
 * Parameters are the one place inference can't help — annotate them all.
 * Function-typed parameters get a full signature; destructured parameters
 * are annotated after the pattern.
 */
import { expect, expectTypeOf, it } from "vitest";

const applyDiscount = (price: number, percent: number): number =>
  price * (1 - percent / 100);

const formatPrices = (prices: number[], format: (price: number) => string): string[] =>
  prices.map(format);

const describeOrder = ({ id, total }: { id: string; total: number }): string =>
  `#${id}: $${total.toFixed(2)}`;

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
