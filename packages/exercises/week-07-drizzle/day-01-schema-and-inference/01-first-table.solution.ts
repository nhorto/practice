/**
 * Exercise 01 — Your first table (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const snippets = sqliteTable("snippets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull().default("plaintext"),
  starred: integer("starred", { mode: "boolean" }).notNull().default(false),
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
