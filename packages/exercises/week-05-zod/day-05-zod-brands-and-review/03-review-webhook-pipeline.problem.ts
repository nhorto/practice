/**
 * Exercise 03 — Review drill: a webhook pipeline
 *
 * Everything from days 1–3 in one boundary: a webhook delivers JSON, you
 * parse it into a discriminated union whose timestamp is transformed into a
 * Date, and a handler switches over it exhaustively. Strict objects, because
 * a webhook payload with unexpected keys means someone is confused.
 *
 * 🎯 Build `WebhookEventSchema` as a z.discriminatedUnion("type", [...]) of
 *    two z.strictObject variants, both carrying
 *    `at: z.iso.datetime()` transformed into a Date:
 *      - type "user.created", email: valid email
 *      - type "user.deleted", reason: "gdpr" | "inactive" (z.enum)
 *    Then finish `describe` with an exhaustive switch.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: two strict variants, discriminated on "type", each with a
//       transformed `at` timestamp.
const WebhookEventSchema = z.unknown();

type WebhookEvent = z.output<typeof WebhookEventSchema>;

const describe = (event: WebhookEvent): string => {
  // TODO: exhaustive switch on `event.type` (never in the default case):
  //   "user.created" -> `created <email> in <utc full year>`
  //   "user.deleted" -> `deleted (<reason>)`
  const exhausted: never = event;
  return exhausted;
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
