/**
 * Scratch 2: enumValues, set() partials, zod<->insert match, RQB columns, FK config.
 */
import { expect, expectTypeOf, it } from "vitest";
import { relations, eq } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  text,
  getTableConfig,
} from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { z } from "zod";

export const loans = sqliteTable("loans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  status: text("status", { enum: ["active", "returned", "overdue"] })
    .notNull()
    .default("active"),
  memberId: integer("member_id").notNull(),
  archived: integer("archived", { mode: "boolean" }).notNull().default(false),
});

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const loansWithFk = sqliteTable("loans_fk", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id),
});

export const membersRelations = relations(members, ({ many }) => ({
  loans: many(loansWithFk),
}));
export const loansFkRelations = relations(loansWithFk, ({ one }) => ({
  member: one(members, {
    fields: [loansWithFk.memberId],
    references: [members.id],
  }),
}));

const schema = { members, loansWithFk, membersRelations, loansFkRelations };
declare const db: BetterSQLite3Database<typeof schema>;

type LoanStatus = (typeof loans.status.enumValues)[number];
type NewLoan = typeof loans.$inferInsert;

const patchLoan = (id: number, patch: Partial<NewLoan>) =>
  db2.update(loans).set(patch).where(eq(loans.id, id)).returning().all();

declare const db2: BetterSQLite3Database<Record<string, never>>;

const loanInput = z.object({
  status: z.enum(["active", "returned", "overdue"]).optional(),
  memberId: z.number().int(),
});

const memberSummaries = () =>
  db.query.members.findMany({
    columns: { id: true, name: true },
    with: { loans: { columns: { id: true } } },
  });

// --- tests ------------------------------------------------------------------

it("fk shows up in table config", () => {
  expect(getTableConfig(loansWithFk).foreignKeys).toHaveLength(1);
  expect(getTableConfig(loans).foreignKeys).toHaveLength(0);
});

it("types", () => {
  expectTypeOf<LoanStatus>().toEqualTypeOf<"active" | "returned" | "overdue">();
  expectTypeOf<NewLoan>().toEqualTypeOf<{
    id?: number;
    status?: "active" | "returned" | "overdue";
    memberId: number;
    archived?: boolean;
  }>();
  expectTypeOf<z.infer<typeof loanInput>>().toExtend<NewLoan>();
  expectTypeOf(patchLoan).returns.items.toEqualTypeOf<typeof loans.$inferSelect>();
  expectTypeOf<Awaited<ReturnType<typeof memberSummaries>>>().toEqualTypeOf<
    { id: number; name: string; loans: { id: number }[] }[]
  >();
});
