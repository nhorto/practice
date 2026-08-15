/**
 * Exercise 04 — `any` vs `unknown` (solution)
 *
 * With `unknown`, each branch narrows the value before using it. The `any`
 * version compiled too — but crashed on `getErrorMessage(404).message`-style
 * inputs. `unknown` turns that runtime surprise into a compile-time demand.
 */
import { expect, expectTypeOf, it } from "vitest";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return String(error);
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
