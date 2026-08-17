/**
 * Exercise 04 — No enums: the `as const` object pattern
 *
 * This codebase never uses `enum`. The replacement is a plain object frozen
 * with `as const`, plus a union derived from it:
 *
 *   const X = { A: "a", B: "b" } as const;
 *   type X = (typeof X)[keyof typeof X]; // "a" | "b"
 *
 * Same autocomplete, same safety — plain strings at runtime. Below, the
 * object and a hand-written union are maintained SEPARATELY, and they
 * already disagree on how to spell "canceled".
 *
 * 🎯 1. Freeze `ORDER_STATUS` with `as const`.
 *    2. Derive the union: `type OrderStatus =
 *       (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];`
 *    The switch in `advance` then narrows properly and the `never` check
 *    proves it's exhaustive.
 */
import { expect, expectTypeOf, it } from "vitest";

const ORDER_STATUS = {
  Pending: "pending",
  Shipped: "shipped",
  Canceled: "canceled",
};

// Hand-written union — drifted ("cancelled" got a second L).
type OrderStatus = "pending" | "shipped" | "cancelled";

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
