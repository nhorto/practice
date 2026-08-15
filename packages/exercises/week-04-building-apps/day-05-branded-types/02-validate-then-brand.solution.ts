/**
 * Exercise 02 — Validate, then brand (solution)
 *
 * The `as Email` sits directly after the validation that justifies it — the
 * whole file's honesty rests on that adjacency. (In week 5 you'll see Zod's
 * `.brand()` do exactly this dance for you.)
 */
import { expect, expectTypeOf, it } from "vitest";

type Email = string & { readonly __brand: "Email" };

const parseEmail = (raw: string): Email | null => {
  const at = raw.indexOf("@");
  if (at <= 0 || at === raw.length - 1) {
    return null;
  }
  return raw as Email;
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
