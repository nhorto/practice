/**
 * Exercise 03 — `Record` for a fixed set of keys
 *
 * `{ [key: string]: T }` accepts ANY string key — great for open-ended data,
 * wrong for a fixed set. `Record<Role, T>` says: exactly these keys, all
 * present. The compiler then catches a missing or misspelled role at the
 * declaration instead of letting it surface as a runtime bug.
 *
 * 🎯 1. Change `permissions`' annotation from an index signature to
 *       `Record<Role, Permission[]>`. The compiler will point out what the
 *       index signature let slip through — fix that too (viewers can "read").
 *    2. Clean up `can`: with a `Record`, the lookup can no longer be
 *       `undefined`, so the `?.`/`??` dance is unnecessary.
 */
import { expect, expectTypeOf, it } from "vitest";

type Role = "admin" | "editor" | "viewer";
type Permission = "read" | "write" | "delete" | "manage-users";

const permissions: { [role: string]: Permission[] } = {
  admin: ["read", "write", "delete", "manage-users"],
  editor: ["read", "write"],
  // "viewer" is missing — the index signature doesn't care.
};

const can = (role: Role, permission: Permission): boolean => {
  return permissions[role]?.includes(permission) ?? false;
};

// --- tests ------------------------------------------------------------------

it("checks admin and editor permissions", () => {
  expect(can("admin", "manage-users")).toBe(true);
  expect(can("editor", "write")).toBe(true);
  expect(can("editor", "delete")).toBe(false);
});

it("viewers can read", () => {
  expect(can("viewer", "read")).toBe(true);
});

it("uses a closed Record, so lookups are never undefined", () => {
  expectTypeOf(permissions).toEqualTypeOf<Record<Role, Permission[]>>();
  expectTypeOf(permissions.admin).toEqualTypeOf<Permission[]>();
});
