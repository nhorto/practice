/**
 * Exercise 04 — `any` vs `unknown`
 *
 * `any` switches the type checker OFF: you can do anything to it, and
 * TypeScript stays silent — even when it will crash at runtime.
 * `unknown` is the safe twin: it accepts any value too, but you can't USE it
 * until you've narrowed it to something concrete.
 *
 * 🎯 1. Change `error: any` to `error: unknown`.
 *    2. TypeScript will now (rightly!) refuse `error.message`. Narrow first:
 *       - if `error instanceof Error`, return its `.message`
 *       - if `typeof error === "string"`, return it as-is
 *       - otherwise return `String(error)`
 */
import { expect, expectTypeOf, it } from "vitest";

const getErrorMessage = (error: any): string => {
  return error.message;
};

// --- tests ------------------------------------------------------------------

it("reads the message off a real Error", () => {
  expect(getErrorMessage(new Error("disk on fire"))).toBe("disk on fire");
});

it("passes strings straight through", () => {
  expect(getErrorMessage("plain string error")).toBe("plain string error");
});

it("stringifies everything else", () => {
  expect(getErrorMessage(404)).toBe("404");
  expect(getErrorMessage(undefined)).toBe("undefined");
});

it("has the correct types", () => {
  // `unknown`, not `any` — the parameter still accepts everything, but the
  // body has to earn each property access.
  expectTypeOf(getErrorMessage).parameter(0).toEqualTypeOf<unknown>();
  expectTypeOf(getErrorMessage).returns.toEqualTypeOf<string>();
});
