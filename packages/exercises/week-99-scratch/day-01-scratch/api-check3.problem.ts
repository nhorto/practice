/**
 * Scratch 3: insert .returning().get() type; empty relations + with -> error?
 */
import { expectTypeOf, it } from "vitest";
import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const chefs = sqliteTable("chefs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chefId: integer("chef_id").notNull(),
});

export const chefsRelations = relations(chefs, () => ({
  // empty on purpose
}));

const schema = { chefs, recipes, chefsRelations };
declare const db: BetterSQLite3Database<typeof schema>;

const createChef = (name: string) =>
  db.insert(chefs).values({ name }).returning().get();

const chefsWithRecipes = () => db.query.chefs.findMany({ with: { recipes: true } });

// --- tests ------------------------------------------------------------------

it("types", () => {
  expectTypeOf<ReturnType<typeof createChef>>().toEqualTypeOf<{
    id: number;
    name: string;
  }>();
  expectTypeOf(chefsWithRecipes).returns.not.toBeAny();
  expectTypeOf<Awaited<ReturnType<typeof chefsWithRecipes>>>().toEqualTypeOf<
    {
      id: number;
      name: string;
      recipes: { id: number; chefId: number }[];
    }[]
  >();
});
