/**
 * Exercise 01 — Your first table
 *
 * A Drizzle table is defined once, in plain JavaScript, and everything else
 * derives from it. Column modifiers are type transformations: `.notNull()`
 * removes `| null` from the column's type, `.primaryKey({ autoIncrement:
 * true })` makes it a non-null number the database fills in, and
 * `.default(...)` records a fallback value.
 *
 * 🎯 Add the missing modifiers to the `snippets` table so it matches the
 *    contract in the tests: `id` is an auto-increment primary key; `title`
 *    and `code` are required; `language` is required but defaults to
 *    "plaintext"; `starred` is a required boolean defaulting to false.
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const snippets = sqliteTable("snippets", {
  id: integer("id"),
  title: text("title"),
  code: text("code"),
  language: text("language"),
  starred: integer("starred", { mode: "boolean" }),
});

// --- tests ------------------------------------------------------------------

it("id is the primary key", () => {
  expect(snippets.id.primary).toBe(true);
});

it("title and code are NOT NULL", () => {
  expect(snippets.title.notNull).toBe(true);
  expect(snippets.code.notNull).toBe(true);
});

it("language and starred have defaults", () => {
  expect(snippets.language.hasDefault).toBe(true);
  expect(snippets.language.default).toBe("plaintext");
  expect(snippets.starred.hasDefault).toBe(true);
  expect(snippets.starred.default).toBe(false);
});

it("the inferred row type has no stray nulls", () => {
  expectTypeOf<typeof snippets.$inferSelect>().toEqualTypeOf<{
    id: number;
    title: string;
    code: string;
    language: string;
    starred: boolean;
  }>();
});
