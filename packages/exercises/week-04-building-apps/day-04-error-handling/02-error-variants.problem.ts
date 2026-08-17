/**
 * Exercise 02 — Error variants as a discriminated union
 *
 * Typed errors shine when each failure mode carries its own data — a URL for
 * network failures, a status code for HTTP errors. Model them as a
 * discriminated union and switch on the discriminant, with an `assertNever`
 * default. The payoff: when the union GROWS, the compiler points at every
 * switch that needs a new case.
 *
 * 🎯 The product team added request timeouts. Watch the compiler walk you
 *    through it:
 *    1. Add a `{ type: "timeout"; ms: number }` variant to `LoadError`
 *       (the tests already use it — that fixes their errors).
 *    2. Both switches now fail in their `default` — the narrowed type is no
 *       longer `never`. Add the `"timeout"` cases the tests describe:
 *       message `Timed out after <ms>ms`; timeouts are retryable.
 */
import { expect, expectTypeOf, it } from "vitest";

type LoadError =
  | { type: "network"; url: string }
  | { type: "http"; status: number }
  | { type: "parse"; detail: string };

const assertNever = (value: never): never => {
  throw new Error(`Unhandled error variant: ${JSON.stringify(value)}`);
};

const describeError = (error: LoadError): string => {
  switch (error.type) {
    case "network":
      return `Network failure reaching ${error.url}`;
    case "http":
      return `Server responded with ${error.status}`;
    case "parse":
      return `Could not parse response: ${error.detail}`;
    default:
      return assertNever(error);
  }
};

const isRetryable = (error: LoadError): boolean => {
  switch (error.type) {
    case "network":
      return true;
    case "http":
      return error.status >= 500;
    case "parse":
      return false;
    default:
      return assertNever(error);
  }
};

// --- tests ------------------------------------------------------------------

it("describes every variant", () => {
  expect(describeError({ type: "network", url: "/api/tasks" })).toBe(
    "Network failure reaching /api/tasks",
  );
  expect(describeError({ type: "http", status: 503 })).toBe(
    "Server responded with 503",
  );
  expect(describeError({ type: "parse", detail: "bad json" })).toBe(
    "Could not parse response: bad json",
  );
  expect(describeError({ type: "timeout", ms: 5000 })).toBe(
    "Timed out after 5000ms",
  );
});

it("knows which errors are worth retrying", () => {
  expect(isRetryable({ type: "network", url: "/api" })).toBe(true);
  expect(isRetryable({ type: "http", status: 503 })).toBe(true);
  expect(isRetryable({ type: "http", status: 404 })).toBe(false);
  expect(isRetryable({ type: "parse", detail: "x" })).toBe(false);
  expect(isRetryable({ type: "timeout", ms: 5000 })).toBe(true);
});

it("has the correct types", () => {
  expectTypeOf<LoadError["type"]>().toEqualTypeOf<
    "network" | "http" | "parse" | "timeout"
  >();
  expectTypeOf(assertNever).parameter(0).toBeNever();
});
