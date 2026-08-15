/**
 * Exercise 02 — relations() unlocks `with:` (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { eq, relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const chefs = sqliteTable("chefs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  chefId: integer("chef_id")
    .notNull()
    .references(() => chefs.id),
});

export const chefsRelations = relations(chefs, ({ many }) => ({
  recipes: many(recipes),
}));

export const recipesRelations = relations(recipes, ({ one }) => ({
  chef: one(chefs, { fields: [recipes.chefId], references: [chefs.id] }),
}));

export type Chef = typeof chefs.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;

const schema = { chefs, recipes, chefsRelations, recipesRelations };
declare const db: BetterSQLite3Database<typeof schema>;

const chefsWithRecipes = () =>
  db.query.chefs.findMany({ with: { recipes: true } });

const recipeWithChef = (id: number) =>
  db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: { chef: true },
  });

// --- tests ------------------------------------------------------------------

it("the tables themselves are unchanged by relations()", () => {
  expect(recipes.chefId.notNull).toBe(true);
});

it("a chef can load all of their recipes", () => {
  expectTypeOf<Awaited<ReturnType<typeof chefsWithRecipes>>>().toEqualTypeOf<
    { id: number; name: string; recipes: Recipe[] }[]
  >();
});

it("a recipe can load its chef", () => {
  expectTypeOf<Awaited<ReturnType<typeof recipeWithChef>>>().toEqualTypeOf<
    { id: number; title: string; chefId: number; chef: Chef } | undefined
  >();
});
