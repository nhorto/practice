/**
 * Exercise 02 — Error variants as a discriminated union (solution)
 *
 * Adding the variant made both switches non-exhaustive, and `assertNever`
 * turned that into compile errors pointing at the exact spots to update.
 * That's the whole trick: `default: assertNever(x)` makes "I forgot a case"
 * impossible to ship.
 */
import { expect, expectTypeOf, it } from "vitest";

type LoadError =
  | { type: "network"; url: string }
  | { type: "http"; status: number }
  | { type: "parse"; detail: string }
  | { type: "timeout"; ms: number };

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
    case "timeout":
      return `Timed out after ${error.ms}ms`;
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
    case "timeout":
      return true;
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
