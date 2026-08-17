/**
 * Exercise 02 — Two brands that must never mix (solution)
 *
 * Same runtime strings, two incompatible compile-time types. The swapped
 * call in `refund` went from "silent data corruption" to "red squiggle" —
 * which is the whole point of branding ids.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const UserIdSchema = z.string().startsWith("usr_").brand<"UserId">();
const OrderIdSchema = z.string().startsWith("ord_").brand<"OrderId">();

type UserId = z.infer<typeof UserIdSchema>;
type OrderId = z.infer<typeof OrderIdSchema>;

// The payment provider's API (don't modify): user first, order second.
const chargeBack = (userId: UserId, orderId: OrderId): string =>
  `refunded ${orderId} for ${userId}`;

const refund = (orderId: OrderId, userId: UserId): string => {
  return chargeBack(userId, orderId);
};

// --- tests ------------------------------------------------------------------

const userId = UserIdSchema.parse("usr_42");
const orderId = OrderIdSchema.parse("ord_9000");

it("refunds with the ids the right way round", () => {
  expect(refund(orderId, userId)).toBe("refunded ord_9000 for usr_42");
});

it("still validates each id's format at the boundary", () => {
  expect(UserIdSchema.safeParse("ord_9000").success).toBe(false);
  expect(OrderIdSchema.safeParse("usr_42").success).toBe(false);
});

it("the compiler refuses to mix the two id kinds", () => {
  expectTypeOf<UserId>().not.toEqualTypeOf<OrderId>();
  // @ts-expect-error — an OrderId is not a UserId
  chargeBack(orderId, orderId);
  // @ts-expect-error — a UserId is not an OrderId
  chargeBack(userId, userId);
});
