/**
 * Exercise 01 — Union types (solution)
 *
 * `id: string | number` — inside, the ternary's `typeof` check narrows each
 * branch. `name: string | null` — every caller is now forced to think about
 * the null case, and the `??` fallback handles it.
 */
import { expect, expectTypeOf, it } from "vitest";

const formatId = (id: string | number) => {
  return typeof id === "number" ? `#${id}` : id.toUpperCase();
};

const displayName = (name: string | null) => {
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
