/**
 * Exercise 04 — Narrowing with truthiness and `in`
 *
 * Two more checks TypeScript understands:
 *   - truthiness: inside `if (value)`, the type drops `undefined`, `null`,
 *     and `""` — careful, it drops `0` and `false` at runtime too!
 *   - `in`: `"email" in contact` picks the union member that has that key.
 *     Perfect when the members are different object shapes.
 *
 * 🎯 1. Implement `firstNonEmpty`: return the first entry that is a
 *       non-empty string, or "n/a" if there is none. A truthiness check
 *       narrows `string | undefined` down to `string`.
 *    2. Implement `contactLine` with an `in` check:
 *         email contact → "mailto:<email>", phone contact → "tel:<phone>".
 */
import { expect, expectTypeOf, it } from "vitest";

const firstNonEmpty = (entries: (string | undefined)[]): string => {
  // TODO: loop over entries; a truthiness check gets you from
  // `string | undefined` (and "") to a usable string.
};

type EmailContact = { name: string; email: string };
type PhoneContact = { name: string; phone: string };

const contactLine = (contact: EmailContact | PhoneContact): string => {
  // TODO: narrow with the `in` operator.
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
