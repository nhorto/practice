/**
 * Drill 03 — Derive everything
 *
 * The capstone drill. The schema, relations, query, Zod schema, and action
 * are all given and correct. What's wrong is every type alias: all three
 * are hand-written copies of things the code already knows. Replace each
 * with a DERIVED type — if you find yourself typing a property name, you're
 * doing it the Python way.
 *
 * NOTE: `db` is type-only; `insertTask`, `getProjectOverviews`, and
 * `createTask` are never called at runtime.
 *
 * 🎯 Derive, don't declare:
 *    - `NewTask` — from the table (`$inferInsert`)
 *    - `ProjectOverview` — from the query
 *      (`Awaited<ReturnType<...>>[number]`)
 *    - `CreateTaskResult` — a real discriminated union
 *      `{ ok: true; value: typeof tasks.$inferSelect } | { ok: false; errors: string[] }`
 */
import { expect, expectTypeOf, it } from "vitest";
import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));
export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
}));

const schema = { projects, tasks, projectsRelations, tasksRelations };
declare const db: BetterSQLite3Database<typeof schema>;

// ❌ hand-written — the table already knows this (and knows it better)
export type NewTask = {
  title: string;
  projectId: number;
};

// ❌ hand-written — the query already knows this
export type ProjectOverview = {
  id: number;
  name: string;
  tasks: (typeof tasks.$inferSelect)[];
};

// ❌ optional soup — not a discriminated union at all
export type CreateTaskResult = {
  ok: boolean;
  value?: typeof tasks.$inferSelect;
  errors?: string[];
};

// Given: everything below is correct — only the aliases above need work.
const insertTask = (row: NewTask) =>
  db.insert(tasks).values(row).returning().get();

const getProjectOverviews = () =>
  db.query.projects.findMany({
    columns: { id: true, name: true },
    with: { tasks: { columns: { id: true, title: true, done: true } } },
  });

export const taskInput = z.object({
  title: z.string().min(1),
  projectId: z.coerce.number().int(),
});

export const createTask = async (raw: unknown): Promise<CreateTaskResult> => {
  const parsed = taskInput.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }
  return { ok: true, value: insertTask(parsed.data) };
};

// --- tests ------------------------------------------------------------------

it("the Zod boundary feeds the insert type", () => {
  const parsed = taskInput.safeParse({ title: "write schema", projectId: "3" });
  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.projectId).toBe(3);
    expectTypeOf(parsed.data).toExtend<NewTask>();
  }
});

it("NewTask comes from the table", () => {
  expectTypeOf<NewTask>().toEqualTypeOf<{
    id?: number;
    title: string;
    done?: boolean;
    projectId: number;
  }>();
});

it("ProjectOverview comes from the query", () => {
  expectTypeOf<ProjectOverview>().toEqualTypeOf<{
    id: number;
    name: string;
    tasks: { id: number; title: string; done: boolean }[];
  }>();
});

it("CreateTaskResult is a discriminated union", () => {
  expectTypeOf<CreateTaskResult>().toEqualTypeOf<
    | { ok: true; value: typeof tasks.$inferSelect }
    | { ok: false; errors: string[] }
  >();
  const failed: CreateTaskResult = { ok: false, errors: ["title required"] };
  if (!failed.ok) {
    expectTypeOf(failed.errors).toEqualTypeOf<string[]>();
  }
});
