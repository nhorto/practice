/**
 * Exercise 01 — Discriminated unions (solution)
 *
 * The parsed value is a real tagged union: `switch (event.status)` narrows
 * each case, and the `never` default keeps the switch honest if a variant is
 * ever added to the schema.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const PaymentEventSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("succeeded"),
    amountCents: z.number().int().min(0),
  }),
  z.object({ status: z.literal("failed"), reason: z.string() }),
  z.object({ status: z.literal("pending") }),
]);

type PaymentEvent = z.infer<typeof PaymentEventSchema>;

const summarize = (event: PaymentEvent): string => {
  switch (event.status) {
    case "succeeded":
      return `received ${event.amountCents} cents`;
    case "failed":
      return `failed: ${event.reason}`;
    case "pending":
      return "still waiting";
    default: {
      const exhausted: never = event;
      return exhausted;
    }
  }
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
