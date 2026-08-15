/**
 * Exercise 03 — Assertion functions (solution)
 *
 * `asserts value is T` is the "insist" version of a type predicate: there is
 * no false branch, because not-a-T means the function threw. Perfect for
 * "this must exist or the app is broken anyway" moments — the code after the
 * call reads like the happy path, and it's fully typed.
 */
import { expect, expectTypeOf, it } from "vitest";

function assertDefined<T>(
  value: T | null | undefined,
  label: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${label} is missing`);
  }
}

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== "number") {
    throw new Error(`expected a number, got ${typeof value}`);
  }
}

// --- tests ------------------------------------------------------------------

const settings: Record<string, string> = { theme: "dark" };

it("narrows a possibly-undefined lookup", () => {
  const theme = settings["theme"];
  assertDefined(theme, "theme");
  // after the assertion, `string | undefined` has become `string`:
  expectTypeOf(theme).toEqualTypeOf<string>();
  expect(theme.toUpperCase()).toBe("DARK");
});

it("throws for missing values", () => {
  expect(() => assertDefined(settings["nope"], "nope")).toThrow("nope is missing");
});

it("narrows unknown to number", () => {
  const raw: unknown = JSON.parse("21");
  assertIsNumber(raw);
  expectTypeOf(raw).toEqualTypeOf<number>();
  expect(raw * 2).toBe(42);
});

it("throws for non-numbers", () => {
  expect(() => assertIsNumber("42")).toThrow("expected a number, got string");
});
