/**
 * Exercise 03 — Assertion functions
 *
 * These functions already throw on bad values — but their `void` return type
 * hides that from the compiler, so after the call the type is as wide as
 * ever. `asserts value is T` says: "if I return normally, value IS a T" —
 * and TypeScript narrows everything after the call.
 *
 * (Assertion functions must be `function` declarations, which these
 * already are — arrow functions need an extra annotation to work.)
 *
 * 🎯 Replace each `void` return type with an `asserts` return type:
 *    - `assertDefined`: `asserts value is T`
 *    - `assertIsNumber`: `asserts value is number`
 */
import { expect, expectTypeOf, it } from "vitest";

function assertDefined<T>(value: T | null | undefined, label: string): void {
  if (value === null || value === undefined) {
    throw new Error(`${label} is missing`);
  }
}

function assertIsNumber(value: unknown): void {
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
