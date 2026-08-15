/**
 * Exercise 03 — Review drill: a webhook pipeline (solution)
 *
 * Composition all the way down: strict objects inside a discriminated
 * union, a shared transformed field, `z.input` documenting the wire format
 * and `z.output` the parsed one — and the switch narrows the union exactly
 * like week 2 taught.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const timestamp = z.iso.datetime().transform((iso) => new Date(iso));

const WebhookEventSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("user.created"),
    email: z.email(),
    at: timestamp,
  }),
  z.strictObject({
    type: z.literal("user.deleted"),
    reason: z.enum(["gdpr", "inactive"]),
    at: timestamp,
  }),
]);

type WebhookEvent = z.output<typeof WebhookEventSchema>;

const describe = (event: WebhookEvent): string => {
  switch (event.type) {
    case "user.created":
      return `created ${event.email} in ${event.at.getUTCFullYear()}`;
    case "user.deleted":
      return `deleted (${event.reason})`;
    default: {
      const exhausted: never = event;
      return exhausted;
    }
  }
};

// --- tests ------------------------------------------------------------------

it("parses and transforms a created event", () => {
  const event = WebhookEventSchema.parse({
    type: "user.created",
    email: "ada@example.com",
    at: "2026-08-15T09:30:00Z",
  });
  expect(event.at).toBeInstanceOf(Date);
  expect(describe(event)).toBe("created ada@example.com in 2026");
});

it("parses a deleted event", () => {
  const event = WebhookEventSchema.parse({
    type: "user.deleted",
    reason: "gdpr",
    at: "2026-08-15T09:30:00Z",
  });
  expect(describe(event)).toBe("deleted (gdpr)");
});

it("rejects unknown tags, bad payloads, and extra keys", () => {
  const at = "2026-08-15T09:30:00Z";
  expect(
    WebhookEventSchema.safeParse({ type: "user.suspended", at }).success,
  ).toBe(false);
  expect(
    WebhookEventSchema.safeParse({ type: "user.created", email: "nope", at })
      .success,
  ).toBe(false);
  expect(
    WebhookEventSchema.safeParse({
      type: "user.deleted",
      reason: "boredom",
      at,
    }).success,
  ).toBe(false);
  // strict: an unexpected key is an error, not silently stripped
  expect(
    WebhookEventSchema.safeParse({
      type: "user.created",
      email: "ada@example.com",
      at,
      debug: true,
    }).success,
  ).toBe(false);
});

it("wire format and parsed type diverge only in `at`", () => {
  expectTypeOf<z.input<typeof WebhookEventSchema>>().toEqualTypeOf<
    | { type: "user.created"; email: string; at: string }
    | { type: "user.deleted"; reason: "gdpr" | "inactive"; at: string }
  >();
  expectTypeOf<WebhookEvent>().toEqualTypeOf<
    | { type: "user.created"; email: string; at: Date }
    | { type: "user.deleted"; reason: "gdpr" | "inactive"; at: Date }
  >();
});
