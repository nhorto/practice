/**
 * Exercise 04 — Review: the status board (solution)
 *
 * One `as const` object feeds everything: the `Status` union, the
 * `satisfies`-checked service map, and the `ServiceName` key union. Nothing
 * is written twice, so nothing can drift.
 */
import { expect, expectTypeOf, it } from "vitest";

const STATUS = {
  Operational: "operational",
  Degraded: "degraded",
  Down: "down",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

const services = {
  api: STATUS.Operational,
  web: STATUS.Operational,
  database: STATUS.Degraded,
} satisfies Record<string, Status>;

type ServiceName = keyof typeof services;

const overallStatus = (current: Record<ServiceName, Status>): Status => {
  const statuses = Object.values(current);
  if (statuses.includes(STATUS.Down)) {
    return STATUS.Down;
  }
  if (statuses.includes(STATUS.Degraded)) {
    return STATUS.Degraded;
  }
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
