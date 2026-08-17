/**
 * Exercise 02 — Type predicates
 *
 * Both guards CHECK the right thing at runtime, but their `boolean` return
 * type throws the knowledge away — `if (isString(x))` narrows nothing, and
 * `.filter(isString)` returns the same wide type it was given. A type
 * predicate return type (`value is T`) is how a function teaches the
 * compiler to narrow.
 *
 * 🎯 Replace each `boolean` return type with a type predicate:
 *    - `isString`: `value is string`
 *    - `isDefined`: `value is T` (this one filters out null AND undefined)
 */
import { expect, expectTypeOf, it } from "vitest";

const isString = (value: unknown): boolean => typeof value === "string";

const isDefined = <T>(value: T | null | undefined): boolean =>
  value !== null && value !== undefined;

// --- tests ------------------------------------------------------------------

it("narrows unknown to string in an if", () => {
  const value: unknown = "hello";
  if (isString(value)) {
    expectTypeOf(value).toEqualTypeOf<string>();
    expect(value.toUpperCase()).toBe("HELLO");
  } else {
    throw new Error("expected a string");
  }
});

it("filters a mixed array down to strings", () => {
  const mixed: unknown[] = ["ts", 1, "js", null];
  const strings = mixed.filter(isString);
  expect(strings).toEqual(["ts", "js"]);
  expectTypeOf(strings).toEqualTypeOf<string[]>();
});

it("filters out null and undefined", () => {
  const maybeNames = ["ada", null, "grace", undefined];
  const names = maybeNames.filter(isDefined);
  expect(names).toEqual(["ada", "grace"]);
  expectTypeOf(names).toEqualTypeOf<string[]>();
});
