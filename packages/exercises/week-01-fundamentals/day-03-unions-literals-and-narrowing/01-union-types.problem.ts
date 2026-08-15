/**
 * Exercise 01 — Union types
 *
 * A union type says a value can be one of several types: `string | number`,
 * `string | null`. Callers can pass any member; the function must handle all
 * of them.
 *
 * 🎯 1. Annotate `formatId` so it accepts a string OR a number.
 *    2. Widen `displayName`'s parameter to also accept `null` — the body's
 *       `??` fallback already copes with it.
 *    Don't change the function bodies.
 */
import { expect, expectTypeOf, it } from "vitest";

const formatId = (id) => {
  return typeof id === "number" ? `#${id}` : id.toUpperCase();
};

const displayName = (name: string) => {
  return name ?? "Anonymous";
};

// --- tests ------------------------------------------------------------------

it("formats numeric and string ids", () => {
  expect(formatId(42)).toBe("#42");
  expect(formatId("abc-1")).toBe("ABC-1");
});

it("falls back for a null name", () => {
  expect(displayName("Ada")).toBe("Ada");
  expect(displayName(null)).toBe("Anonymous");
});

it("has the correct types", () => {
  expectTypeOf(formatId).toEqualTypeOf<(id: string | number) => string>();
  expectTypeOf(displayName).parameter(0).toEqualTypeOf<string | null>();
});
