/**
 * Exercise 01 — Foreign keys with .references() (solution)
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
  authorId: integer("author_id")
    .notNull()
    .references(() => authors.id, { onDelete: "cascade" }),
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
