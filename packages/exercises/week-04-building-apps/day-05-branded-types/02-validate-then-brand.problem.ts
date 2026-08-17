/**
 * Exercise 02 — Validate, then brand
 *
 * A brand is only as trustworthy as its constructor. If the constructor
 * validates before asserting, then holding an `Email` PROVES validation
 * happened — no function that receives one ever needs to re-check. That's
 * the real payoff: validation exactly once, at the boundary.
 *
 * 🎯 Implement `parseEmail`:
 *    - invalid input returns `null` (no "@", or "@" at the very start/end),
 *    - valid input is branded with `as Email` and returned.
 *    The `as` is EARNED here: validation on the line above justifies it.
 */
import { expect, expectTypeOf, it } from "vitest";

type Email = string & { readonly __brand: "Email" };

const parseEmail = (raw: string): Email | null => {
  // TODO: validate first, then `return raw as Email`.
  return raw;
};

// Because `to` is Email, this function can't be called with junk — and it
// doesn't need to validate anything itself.
const sendWelcome = (to: Email): string => `Welcome mail sent to ${to}`;

// --- tests ------------------------------------------------------------------

it("accepts a valid email", () => {
  const email = parseEmail("ada@example.com");
  expect(email).toBe("ada@example.com");
  if (email !== null) {
    expect(sendWelcome(email)).toBe("Welcome mail sent to ada@example.com");
  }
});

it("rejects invalid emails", () => {
  expect(parseEmail("nope")).toBeNull();
  expect(parseEmail("@lonely")).toBeNull();
  expect(parseEmail("trailing@")).toBeNull();
});

it("only accepts parsed emails", () => {
  // @ts-expect-error — raw strings must go through parseEmail first
  sendWelcome("ada@example.com");
});

it("has the correct types", () => {
  expectTypeOf(parseEmail).returns.toEqualTypeOf<Email | null>();
  expectTypeOf(sendWelcome).parameter(0).toEqualTypeOf<Email>();
});
