/**
 * Exercise 02 — Two brands that must never mix
 *
 * The classic production bug: user ids and order ids are both strings, so
 * `refund(orderId, userId)` — arguments swapped — compiles fine and corrupts
 * data at 2am. Two DIFFERENT brands make each mix-up a compile error, and
 * because the brands come from schemas, every id in play has also been
 * format-checked.
 *
 * 🎯 Brand `UserIdSchema` with "UserId" and `OrderIdSchema` with "OrderId",
 *    then fix `refund` so it passes the ids to `chargeBack` in the right
 *    order. The @ts-expect-error lines mark calls that must NOT compile once
 *    the brands are in place.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: brand these two schemas differently.
const UserIdSchema = z.string().startsWith("usr_");
const OrderIdSchema = z.string().startsWith("ord_");

type UserId = z.infer<typeof UserIdSchema>;
type OrderId = z.infer<typeof OrderIdSchema>;

// The payment provider's API (don't modify): user first, order second.
const chargeBack = (userId: UserId, orderId: OrderId): string =>
  `refunded ${orderId} for ${userId}`;

const refund = (orderId: OrderId, userId: UserId): string => {
  // TODO: this call has the arguments swapped — with real brands it won't
  //       even compile. Fix the order.
  return chargeBack(orderId, userId);
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
