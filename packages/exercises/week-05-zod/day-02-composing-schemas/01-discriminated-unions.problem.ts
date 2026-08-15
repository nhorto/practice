/**
 * Exercise 01 — Discriminated unions
 *
 * When every variant carries a literal tag field, `z.discriminatedUnion` is
 * the runtime twin of the tagged unions you know from TypeScript: it checks
 * the tag first (fast, precise errors), and the inferred type narrows in a
 * `switch` exactly like a hand-written discriminated union.
 *
 * 🎯 Replace `z.unknown()` with a `z.discriminatedUnion("status", [...])` of
 *    three object schemas:
 *      - status "succeeded", amountCents: number (int, min 0)
 *      - status "failed",    reason: string
 *      - status "pending"    (nothing else)
 *    Then finish the exhaustive `switch` in `summarize`.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: model the three payment event variants.
const PaymentEventSchema = z.unknown();

type PaymentEvent = z.infer<typeof PaymentEventSchema>;

const summarize = (event: PaymentEvent): string => {
  // TODO: switch on `event.status`; every case returns, and the default
  //       proves exhaustiveness by assigning `event` to `never`.
  const exhausted: never = event;
  return exhausted;
};

// --- tests ------------------------------------------------------------------

it("parses each variant", () => {
  expect(
    PaymentEventSchema.parse({ status: "succeeded", amountCents: 1250 }),
  ).toEqual({ status: "succeeded", amountCents: 1250 });
  expect(
    PaymentEventSchema.parse({ status: "failed", reason: "card_declined" }),
  ).toEqual({ status: "failed", reason: "card_declined" });
  expect(PaymentEventSchema.parse({ status: "pending" })).toEqual({
    status: "pending",
  });
});

it("rejects an unknown status tag", () => {
  expect(PaymentEventSchema.safeParse({ status: "refunded" }).success).toBe(
    false,
  );
});

it("summarizes every variant", () => {
  expect(summarize({ status: "succeeded", amountCents: 1250 })).toBe(
    "received 1250 cents",
  );
  expect(summarize({ status: "failed", reason: "card_declined" })).toBe(
    "failed: card_declined",
  );
  expect(summarize({ status: "pending" })).toBe("still waiting");
});

it("infers a discriminated union type", () => {
  expectTypeOf<PaymentEvent>().toEqualTypeOf<
    | { status: "succeeded"; amountCents: number }
    | { status: "failed"; reason: string }
    | { status: "pending" }
  >();
});
