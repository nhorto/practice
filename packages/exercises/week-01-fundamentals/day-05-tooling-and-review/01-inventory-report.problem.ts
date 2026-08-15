/**
 * Exercise 01 — Inventory report (review)
 *
 * Review of days 1–3: type aliases, literal unions, optional properties,
 * and tuples. No new concepts — but you have to combine them.
 *
 * 🎯 1. `StockLevel` should be the literal union "in-stock" | "low" | "out".
 *    2. `tally` should return a TUPLE of three counts:
 *       [inStock: number, low: number, out: number].
 *       You'll need to annotate `counts` as a tuple too: `counts[0]++` on a
 *       plain number[] is an error under `noUncheckedIndexedAccess` — the
 *       array doesn't know it has three elements. A tuple does.
 *    Annotations only — the logic already works.
 */
import { expect, expectTypeOf, it } from "vitest";

export type StockLevel = string;

type Item = {
  name: string;
  count: number;
  restockAt?: number;
};

const stockLevel = (item: Item): StockLevel => {
  if (item.count === 0) {
    return "out";
  }
  // Restock threshold defaults to 5 when the item doesn't set one.
  return item.count <= (item.restockAt ?? 5) ? "low" : "in-stock";
};

const tally = (items: Item[]): number[] => {
  const counts: number[] = [0, 0, 0];
  for (const item of items) {
    const level = stockLevel(item);
    if (level === "in-stock") {
      counts[0]++;
    } else if (level === "low") {
      counts[1]++;
    } else {
      counts[2]++;
    }
  }
  return counts;
};

// --- tests ------------------------------------------------------------------

const items: Item[] = [
  { name: "keyboard", count: 12 },
  { name: "mouse", count: 3 },
  { name: "webcam", count: 0 },
  { name: "hub", count: 20, restockAt: 25 },
];

it("classifies stock levels, honoring the custom threshold", () => {
  expect(stockLevel(items[0]!)).toBe("in-stock");
  expect(stockLevel(items[1]!)).toBe("low");
  expect(stockLevel(items[2]!)).toBe("out");
  expect(stockLevel(items[3]!)).toBe("low");
});

it("tallies items into [inStock, low, out]", () => {
  expect(tally(items)).toEqual([1, 2, 1]);
});

it("has the correct types", () => {
  expectTypeOf<StockLevel>().toEqualTypeOf<"in-stock" | "low" | "out">();
  expectTypeOf(tally).returns.toEqualTypeOf<
    [inStock: number, low: number, out: number]
  >();

  // @ts-expect-error — "backordered" is not a StockLevel
  const bad: StockLevel = "backordered";
  expect(bad).toBeDefined();
});
