/**
 * Exercise 01 — Replace the enum with `as const`
 *
 * Enums are a TypeScript-only runtime feature with odd corners: a string
 * enum is *nominal*, so even the exact right string literal is rejected
 * unless it's written as `OrderStatus.Pending`. The TS-dev alternative — an
 * `as const` object plus a derived union — gives the same autocomplete and
 * the same runtime object, while staying structural: plain strings flow in
 * and out freely.
 *
 * 🎯 Delete the enum. Rebuild `OrderStatus` as an `as const` object AND a
 *    derived union type of the same name:
 *      const OrderStatus = { ... } as const;
 *      type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
 *    Don't change `advance` — its body already works with both versions.
 */
import { expect, expectTypeOf, it } from "vitest";

enum OrderStatus {
  Pending = "pending",
  Shipped = "shipped",
  Delivered = "delivered",
}

const advance = (status: OrderStatus): OrderStatus => {
  switch (status) {
    case OrderStatus.Pending:
      return OrderStatus.Shipped;
    case OrderStatus.Shipped:
      return OrderStatus.Delivered;
    case OrderStatus.Delivered:
      return OrderStatus.Delivered;
  }
};

// --- tests ------------------------------------------------------------------

it("advances through the statuses", () => {
  expect(advance(OrderStatus.Pending)).toBe("shipped");
  // Plain strings must work too — an enum rejects this call:
  expect(advance("shipped")).toBe("delivered");
  expect(advance("delivered")).toBe("delivered");
});

it("is just an object of strings at runtime", () => {
  expect(Object.values(OrderStatus)).toEqual(["pending", "shipped", "delivered"]);
});

it("has the correct types", () => {
  expectTypeOf<OrderStatus>().toEqualTypeOf<"pending" | "shipped" | "delivered">();
  expectTypeOf(advance).returns.toEqualTypeOf<"pending" | "shipped" | "delivered">();
});
