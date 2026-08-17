/**
 * Exercise 04 — Review: the status board
 *
 * Everything from this week in one exercise: an `as const` object as the
 * single source of truth, a union derived with
 * `(typeof X)[keyof typeof X]`, keys derived with `keyof typeof`, a
 * `satisfies`-checked config, and a `Record` parameter.
 *
 * 🎯 1. Freeze `STATUS` with `as const`.
 *    2. Derive `Status` from it (the no-enums pattern).
 *    3. Validate `services` with `satisfies Record<string, Status>` —
 *       keeping its exact keys.
 *    4. Derive `ServiceName` with `keyof typeof services`.
 *    5. Implement `overallStatus`: "down" if any service is down, else
 *       "degraded" if any is degraded, else "operational"
 *       (`Object.values` gives you a `Status[]`).
 */
import { expect, expectTypeOf, it } from "vitest";

const STATUS = {
  Operational: "operational",
  Degraded: "degraded",
  Down: "down",
};

type Status = "operational" | "degraded"; // hand-written, drifted — derive it!

const services = {
  api: STATUS.Operational,
  web: STATUS.Operational,
  database: STATUS.Degraded,
};

type ServiceName = string; // too wide — derive it!

const overallStatus = (current: Record<ServiceName, Status>): Status => {
  // TODO: worst status wins: down > degraded > operational.
  return STATUS.Operational;
};

// --- tests ------------------------------------------------------------------

it("derives Status and ServiceName instead of declaring them", () => {
  expectTypeOf<Status>().toEqualTypeOf<"operational" | "degraded" | "down">();
  expectTypeOf<ServiceName>().toEqualTypeOf<"api" | "web" | "database">();
});

it("reports the worst status across services", () => {
  expect(
    overallStatus({ api: "operational", web: "operational", database: "operational" }),
  ).toBe("operational");
  expect(
    overallStatus({ api: "operational", web: "degraded", database: "operational" }),
  ).toBe("degraded");
  expect(
    overallStatus({ api: "down", web: "degraded", database: "operational" }),
  ).toBe("down");
});

it("rejects unknown services and statuses", () => {
  // @ts-expect-error — "cache" is not a known service
  overallStatus({ api: "operational", web: "operational", database: "operational", cache: "operational" });
});
