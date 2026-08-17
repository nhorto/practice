/**
 * Exercise 04 — Narrowing with truthiness and `in` (solution)
 *
 * `if (entry)` removes `undefined` AND the empty string in one check.
 * `"email" in contact` tells TypeScript which object shape it's holding —
 * no discriminant property needed (that trick arrives tomorrow).
 */
import { expect, expectTypeOf, it } from "vitest";

const firstNonEmpty = (entries: (string | undefined)[]): string => {
  for (const entry of entries) {
    if (entry) {
      return entry;
    }
  }
  return "n/a";
};

type EmailContact = { name: string; email: string };
type PhoneContact = { name: string; phone: string };

const contactLine = (contact: EmailContact | PhoneContact): string => {
  if ("email" in contact) {
    return `mailto:${contact.email}`;
  }
  return `tel:${contact.phone}`;
};

// --- tests ------------------------------------------------------------------

it("finds the first non-empty entry", () => {
  expect(firstNonEmpty([undefined, "", "hello", "world"])).toBe("hello");
  expect(firstNonEmpty([undefined, ""])).toBe("n/a");
  expect(firstNonEmpty([])).toBe("n/a");
});

it("builds the right link for each contact shape", () => {
  expect(contactLine({ name: "Ada", email: "ada@example.com" })).toBe(
    "mailto:ada@example.com",
  );
  expect(contactLine({ name: "Alan", phone: "+44 123" })).toBe("tel:+44 123");
});

it("has the correct types", () => {
  expectTypeOf(firstNonEmpty).toEqualTypeOf<
    (entries: (string | undefined)[]) => string
  >();
  expectTypeOf(contactLine).parameter(0).toEqualTypeOf<
    EmailContact | PhoneContact
  >();
});
