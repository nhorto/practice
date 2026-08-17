/**
 * Exercise 04 — No enums: the `as const` object pattern (solution)
 *
 * The object is the only place statuses are spelled out; the union is
 * derived, so it CANNOT disagree. With literal case values, the switch
 * narrows and the `never` default proves exhaustiveness.
 */
import { expect, expectTypeOf, it } from "vitest";

const ORDER_STATUS = {
  Pending: "pending",
  Shipped: "shipped",
  Canceled: "canceled",
} as const;

type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

const advance = (status: OrderStatus): OrderStatus => {
  switch (status) {
    case ORDER_STATUS.Pending:
      return ORDER_STATUS.Shipped;
    case ORDER_STATUS.Shipped:
      return ORDER_STATUS.Shipped;
    case ORDER_STATUS.Canceled:
      return ORDER_STATUS.Canceled;
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
};

// --- tests ------------------------------------------------------------------

it("derives the union from the object", () => {
  expectTypeOf<OrderStatus>().toEqualTypeOf<"pending" | "shipped" | "canceled">();
  expectTypeOf<(typeof ORDER_STATUS)["Canceled"]>().toEqualTypeOf<"canceled">();
});

it("advances an order", () => {
  expect(advance("pending")).toBe("shipped");
  expect(advance("shipped")).toBe("shipped");
  expect(advance("canceled")).toBe("canceled");
});

it("rejects statuses outside the set", () => {
  // @ts-expect-error — "refunded" is not an OrderStatus
  advance("refunded");
});
