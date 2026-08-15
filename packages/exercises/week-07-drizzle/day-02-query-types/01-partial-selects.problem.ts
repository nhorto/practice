/**
 * Exercise 01 — Partial selects change the row type
 *
 * `db.select().from(books)` returns every column. Pass an object to
 * `select({ ... })` and the row type becomes exactly that object's shape —
 * including any keys you rename. No annotations anywhere: the query IS the
 * type.
 *
 * NOTE: there is no live database here. `db` is `declare`d (type-only) and
 * the query functions are never called — the tests are purely type-level.
 *
 * 🎯 Rewrite `getBookList` and `getCatalogRows` as partial selects so their
 *    return types match the tests. Don't annotate the return types — let the
 *    select shape produce them.
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

// TODO: only the id and title columns.
const getBookList = () => db.select().from(books).all();

// TODO: rename the keys — `label` from books.title, `by` from books.author.
const getCatalogRows = () => db.select().from(books).all();

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
