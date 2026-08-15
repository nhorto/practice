/**
 * Exercise 01 — Partial selects change the row type (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  year: integer("year").notNull(),
  rating: integer("rating"),
});

export type Book = typeof books.$inferSelect;

const schema = { books };
declare const db: BetterSQLite3Database<typeof schema>;

// Given: a full select returns the whole row.
const getAllBooks = () => db.select().from(books).all();

// The select shape IS the row type: { id: number; title: string }.
const getBookList = () => db.select({ id: books.id, title: books.title }).from(books).all();

// The keys you pick become the property names.
const getCatalogRows = () =>
  db.select({ label: books.title, by: books.author }).from(books).all();

// --- tests ------------------------------------------------------------------

it("the schema object is still plain JS at runtime", () => {
  expect(books.rating.notNull).toBe(false);
});

it("a full select returns the whole row", () => {
  expectTypeOf<ReturnType<typeof getAllBooks>>().toEqualTypeOf<Book[]>();
});

it("a partial select narrows the row type", () => {
  expectTypeOf<ReturnType<typeof getBookList>>().toEqualTypeOf<
    { id: number; title: string }[]
  >();
});

it("renamed keys rename the row's properties", () => {
  expectTypeOf<ReturnType<typeof getCatalogRows>>().toEqualTypeOf<
    { label: string; by: string }[]
  >();
});
