/**
 * Exercise 03 — `{}` does not mean "object" (solution)
 *
 * `Record<string, unknown>` says what we meant: a plain object whose values
 * we haven't inspected yet. Primitives no longer sneak through, and the
 * `@ts-expect-error` assertions in the tests now have real errors to eat.
 */
import { expect, expectTypeOf, it } from "vitest";

const isEmptyObject = (value: Record<string, unknown>): boolean =>
  Object.keys(value).length === 0;

const tagRecord = (record: Record<string, unknown>): Record<string, unknown> => ({
  ...record,
  tagged: true,
});

// --- tests ------------------------------------------------------------------

it("detects empty objects", () => {
  expect(isEmptyObject({})).toBe(true);
  expect(isEmptyObject({ a: 1 })).toBe(false);
});

it("tags a record", () => {
  expect(tagRecord({ name: "ada" })).toEqual({ name: "ada", tagged: true });
});

it("rejects primitives", () => {
  // @ts-expect-error — a string is not a plain object
  isEmptyObject("hello");
  // @ts-expect-error — a number is not a plain object
  tagRecord(42);
});

it("has the correct types", () => {
  expectTypeOf(isEmptyObject).parameter(0).toEqualTypeOf<Record<string, unknown>>();
  expectTypeOf(tagRecord).parameter(0).toEqualTypeOf<Record<string, unknown>>();
});
