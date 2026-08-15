/**
 * Scratch: verify drizzle 0.44 API surface for the exercises.
 */
import { expect, expectTypeOf, it } from "vitest";
import { relations, eq, and, or } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: ["admin", "member"] }).notNull().default("member"),
  bio: text("bio"),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));

const schema = { users, posts, usersRelations, postsRelations };

declare const db: BetterSQLite3Database<typeof schema>;

type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;

const getUserNames = () =>
  db.select({ id: users.id, name: users.name }).from(users).all();

const getAdmins = () =>
  db.select().from(users).where(eq(users.role, "admin")).all();

const insertUser = (u: NewUser) => db.insert(users).values(u).returning().all();

const renameUser = (id: number, name: string) =>
  db
    .update(users)
    .set({ name })
    .where(eq(users.id, id))
    .returning({ id: users.id })
    .all();

const deleteUser = (id: number) =>
  db.delete(users).where(and(eq(users.id, id), or(eq(users.role, "member"), eq(users.role, "admin"))));

const getUsersWithPosts = () =>
  db.query.users.findMany({ with: { posts: true } });

const findUser = (id: number) =>
  db.query.users.findFirst({ where: eq(users.id, id) });

// --- tests ------------------------------------------------------------------

it("schema runtime is safe", () => {
  expect(users.name.notNull).toBe(true);
  expect(users.id.primary).toBe(true);
  expect(users.role.hasDefault).toBe(true);
});

it("types", () => {
  expectTypeOf<User>().toEqualTypeOf<{
    id: number;
    name: string;
    email: string;
    role: "admin" | "member";
    bio: string | null;
    createdAt: Date | null;
  }>();
  expectTypeOf<NewUser["id"]>().toEqualTypeOf<number | undefined>();
  expectTypeOf<ReturnType<typeof getUserNames>>().toEqualTypeOf<
    { id: number; name: string }[]
  >();
  expectTypeOf<ReturnType<typeof getAdmins>>().toEqualTypeOf<User[]>();
  expectTypeOf<ReturnType<typeof insertUser>>().toEqualTypeOf<User[]>();
  expectTypeOf<ReturnType<typeof renameUser>>().toEqualTypeOf<{ id: number }[]>();
  expectTypeOf<Awaited<ReturnType<typeof getUsersWithPosts>>>().toEqualTypeOf<
    {
      id: number;
      name: string;
      email: string;
      role: "admin" | "member";
      bio: string | null;
      createdAt: Date | null;
      posts: { id: number; title: string; authorId: number }[];
    }[]
  >();
  expectTypeOf<Awaited<ReturnType<typeof findUser>>>().toEqualTypeOf<
    User | undefined
  >();
  expectTypeOf(deleteUser).returns.not.toBeAny();
});
