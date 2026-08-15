/**
 * Exercise 04 — Guarding unknown data (solution)
 *
 * The guard narrows step by step: rule out non-objects and null, then check
 * each property's type. The one `as Record<string, unknown>` is honest — an
 * object whose properties we haven't inspected yet — unlike `as Contact`,
 * which would claim the answer before checking.
 *
 * `parseContacts` then gets its element type for free: `.filter(isContact)`
 * uses the predicate to turn "some array" into `Contact[]`.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Contact = { name: string; email: string };

const isContact = (value: unknown): value is Contact => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate["name"] === "string" && typeof candidate["email"] === "string"
  );
};

const parseContacts = (raw: unknown): Contact[] => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter(isContact);
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
