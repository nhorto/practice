/**
 * Exercise 04 — Guarding unknown data
 *
 * Data from JSON.parse, APIs, or localStorage arrives as `unknown` — and
 * `as Contact` would just be wishful thinking. A real guard checks every
 * property at runtime, and its type predicate lets the types follow.
 *
 * No hints this time — write both from scratch.
 *
 * 🎯 1. Implement `isContact`: true only when `value` is an object with a
 *       string `name` AND a string `email`. Narrow honestly — no `as Contact`.
 *       (Tip: after ruling out `null` and non-objects, you may treat the
 *       value as `Record<string, unknown>` and check each property.)
 *    2. Implement `parseContacts`: given `unknown`, return the elements that
 *       are Contacts. If the input isn't even an array, return [].
 */
import { expect, expectTypeOf, it } from "vitest";

export type Contact = { name: string; email: string };

const isContact = (value: unknown): value is Contact => {
  // TODO: rule out non-objects and null, then check both properties.
  return false;
};

const parseContacts = (raw: unknown): Contact[] => {
  // TODO: not an array? return []. Otherwise keep only the real Contacts.
  return [];
};

// --- tests ------------------------------------------------------------------

const goodInput: unknown = JSON.parse(
  '[{"name":"Ada","email":"ada@lovelace.dev"},{"name":"NoEmail"},42,null]',
);

it("accepts a real contact", () => {
  expect(isContact({ name: "Ada", email: "ada@lovelace.dev" })).toBe(true);
});

it("rejects non-objects and partial shapes", () => {
  expect(isContact(null)).toBe(false);
  expect(isContact("ada")).toBe(false);
  expect(isContact(42)).toBe(false);
  expect(isContact({ name: "NoEmail" })).toBe(false);
  expect(isContact({ name: 1, email: 2 })).toBe(false);
});

it("keeps only the valid contacts", () => {
  const contacts = parseContacts(goodInput);
  expect(contacts).toEqual([{ name: "Ada", email: "ada@lovelace.dev" }]);
  expectTypeOf(contacts).toEqualTypeOf<Contact[]>();
});

it("returns an empty array for non-array input", () => {
  expect(parseContacts({ nope: true })).toEqual([]);
  expect(parseContacts("[]")).toEqual([]);
});
