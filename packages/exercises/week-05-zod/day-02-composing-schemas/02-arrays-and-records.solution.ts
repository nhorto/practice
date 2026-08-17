/**
 * Exercise 02 — Arrays and records (solution)
 *
 * Note `z.record(z.string(), ...)` — v4 requires the key schema explicitly.
 * With `noUncheckedIndexedAccess`, `stock[sku]` is `number | undefined`, so
 * `inStock` handles the miss with `?? 0` instead of pretending it can't
 * happen.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const CartSchema = z.array(
  z.object({
    sku: z.string(),
    qty: z.number().int().min(1),
  }),
);

const StockSchema = z.record(z.string(), z.number().int().min(0));

type Cart = z.infer<typeof CartSchema>;
type Stock = z.infer<typeof StockSchema>;

const totalItems = (cart: Cart): number => {
  return cart.reduce((sum, line) => sum + line.qty, 0);
};

const inStock = (stock: Stock, sku: string): boolean => {
  return (stock[sku] ?? 0) > 0;
};

// --- tests ------------------------------------------------------------------

it("parses a cart and rejects bad lines", () => {
  const cart = CartSchema.parse([
    { sku: "tea-001", qty: 2 },
    { sku: "mug-042", qty: 1 },
  ]);
  expect(totalItems(cart)).toBe(3);
  expect(CartSchema.safeParse([{ sku: "tea-001", qty: 0 }]).success).toBe(false);
  expect(CartSchema.safeParse([{ sku: 7, qty: 1 }]).success).toBe(false);
});

it("parses a stock record and rejects bad values", () => {
  const stock = StockSchema.parse({ "tea-001": 14, "mug-042": 0 });
  expect(inStock(stock, "tea-001")).toBe(true);
  expect(inStock(stock, "mug-042")).toBe(false);
  expect(inStock(stock, "ghost-999")).toBe(false);
  expect(StockSchema.safeParse({ "tea-001": -3 }).success).toBe(false);
  expect(StockSchema.safeParse({ "tea-001": "lots" }).success).toBe(false);
});

it("infers the collection types", () => {
  expectTypeOf<Cart>().toEqualTypeOf<{ sku: string; qty: number }[]>();
  expectTypeOf<Stock>().toEqualTypeOf<Record<string, number>>();
});
