/**
 * Exercise 04 — Typed patches: derive the update's input type (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { eq } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  displayName: text("display_name").notNull(),
  tagline: text("tagline"),
  theme: text("theme", { enum: ["light", "dark"] }).notNull().default("light"),
});

export type Profile = typeof profiles.$inferSelect;

// Derived: any subset of insertable columns, minus the primary key.
export type ProfilePatch = Partial<Omit<typeof profiles.$inferInsert, "id">>;

const schema = { profiles };
declare const db: BetterSQLite3Database<typeof schema>;

const updateProfile = (id: number, patch: ProfilePatch) =>
  db
    .update(profiles)
    .set(patch)
    .where(eq(profiles.id, id))
    .returning()
    .all();

// --- tests ------------------------------------------------------------------

it("theme defaults to light", () => {
  expect(profiles.theme.default).toBe("light");
});

it("a patch is partial and derived from the table", () => {
  expectTypeOf<ProfilePatch>().toEqualTypeOf<{
    displayName?: string;
    tagline?: string | null;
    theme?: "light" | "dark";
  }>();
});

it("accepts sparse patches, including clearing a nullable column", () => {
  expectTypeOf(updateProfile).toBeCallableWith(1, {});
  expectTypeOf(updateProfile).toBeCallableWith(1, { tagline: null });
  expectTypeOf(updateProfile).toBeCallableWith(1, { theme: "dark" });
});

it("returns the updated rows", () => {
  expectTypeOf<ReturnType<typeof updateProfile>>().toEqualTypeOf<Profile[]>();
});
