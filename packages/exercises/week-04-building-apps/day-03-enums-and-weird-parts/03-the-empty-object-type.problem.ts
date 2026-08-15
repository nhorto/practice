/**
 * Exercise 03 — `{}` does not mean "object"
 *
 * The weirdest type in TypeScript: `{}` means "any value that is not null or
 * undefined". Strings, numbers, booleans — all assignable to `{}`, because
 * structurally they have "at least no properties". For "a plain object with
 * unknown values" the honest type is `Record<string, unknown>` (and for
 * "any object-ish thing, including arrays and functions", `object`).
 *
 * 🎯 Both functions below use `{}` and happily accept primitives. Retype
 *    their parameters as `Record<string, unknown>` so the marked calls
 *    become the errors they always should have been.
 */
import { expect, expectTypeOf, it } from "vitest";

const isEmptyObject = (value: {}): boolean => Object.keys(value).length === 0;

const tagRecord = (record: {}): Record<string, unknown> => ({
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
