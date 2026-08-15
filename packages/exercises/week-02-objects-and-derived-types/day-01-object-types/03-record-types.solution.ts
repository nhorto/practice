/**
 * Exercise 03 — `Record` for a fixed set of keys (solution)
 *
 * `Record<Role, Permission[]>` forced us to add the missing "viewer" entry,
 * and because every key is guaranteed present, `permissions[role]` is a
 * plain `Permission[]` — no `undefined` to dance around.
 */
import { expect, expectTypeOf, it } from "vitest";

type Role = "admin" | "editor" | "viewer";
type Permission = "read" | "write" | "delete" | "manage-users";

const permissions: Record<Role, Permission[]> = {
  admin: ["read", "write", "delete", "manage-users"],
  editor: ["read", "write"],
  viewer: ["read"],
};

const can = (role: Role, permission: Permission): boolean => {
  return permissions[role].includes(permission);
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
