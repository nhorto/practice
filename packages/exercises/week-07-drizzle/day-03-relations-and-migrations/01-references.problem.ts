/**
 * Exercise 01 — Foreign keys with .references()
 *
 * `.references(() => authors.id)` adds a real FOREIGN KEY constraint to the
 * generated SQL — the database will refuse an article pointing at a
 * nonexistent author. At the type level it does nothing by itself: the
 * column is still just an integer, so you ALSO decide its nullability.
 * An article must have an author, so the column should be `.notNull()`.
 *
 * 🎯 Make `articles.authorId` a required foreign key to `authors.id`, with
 *    `{ onDelete: "cascade" }` so deleting an author removes their articles.
 */
import { expect, expectTypeOf, it } from "vitest";
import {
  sqliteTable,
  integer,
  text,
  getTableConfig,
} from "drizzle-orm/sqlite-core";

export const authors = sqliteTable("authors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  authorId: integer("author_id"),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

// --- tests ------------------------------------------------------------------

it("articles carries exactly one foreign key", () => {
  const { foreignKeys } = getTableConfig(articles);
  expect(foreignKeys).toHaveLength(1);
});

it("the foreign key cascades on delete", () => {
  const fk = getTableConfig(articles).foreignKeys[0];
  expect(fk?.onDelete).toBe("cascade");
});

it("author_id is a plain required number in both row types", () => {
  expectTypeOf<Article>().toEqualTypeOf<{
    id: number;
    title: string;
    authorId: number;
  }>();
  expectTypeOf<NewArticle["authorId"]>().toEqualTypeOf<number>();
});
