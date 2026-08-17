/**
 * Exercise 01 — Replace the enum with `as const` (solution)
 *
 * A const and a type can share a name — `OrderStatus` is the object when
 * used as a value, the union when used as a type. Callers get enum-style
 * autocomplete (`OrderStatus.Pending`) but plain `"pending"` strings are
 * accepted too, because the union is structural.
 */
import { expect, expectTypeOf, it } from "vitest";

const OrderStatus = {
  Pending: "pending",
  Shipped: "shipped",
  Delivered: "delivered",
} as const;

type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

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
