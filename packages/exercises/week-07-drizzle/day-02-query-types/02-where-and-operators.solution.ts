/**
 * Exercise 02 — where + eq/and/or: the schema types your filters (solution)
 */
import { expect, expectTypeOf, it } from "vitest";
import { and, eq, or } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const loans = sqliteTable("loans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberName: text("member_name").notNull(),
  status: text("status", { enum: ["active", "returned", "overdue"] })
    .notNull()
    .default("active"),
  dueYear: integer("due_year").notNull(),
});

export type Loan = typeof loans.$inferSelect;

// Derived once from the column — no hand-written union to drift.
export type LoanStatus = (typeof loans.status.enumValues)[number];

const schema = { loans };
declare const db: BetterSQLite3Database<typeof schema>;

const findLoan = (id: number) =>
  db.select().from(loans).where(eq(loans.id, id)).all();

const loansByStatus = (status: LoanStatus) =>
  db.select().from(loans).where(eq(loans.status, status)).all();

const needsAttention = (member: string) =>
  db
    .select()
    .from(loans)
    .where(
      and(
        eq(loans.memberName, member),
        or(eq(loans.status, "active"), eq(loans.status, "overdue")),
      ),
    )
    .all();

// --- tests ------------------------------------------------------------------

it("the status column carries its enum at runtime too", () => {
  expect(loans.status.enumValues).toEqual(["active", "returned", "overdue"]);
});

it("ids are numbers end to end", () => {
  expectTypeOf(findLoan).parameter(0).toEqualTypeOf<number>();
  expectTypeOf<ReturnType<typeof findLoan>>().toEqualTypeOf<Loan[]>();
});

it("the status parameter derives its union from the column", () => {
  expectTypeOf(loansByStatus)
    .parameter(0)
    .toEqualTypeOf<"active" | "returned" | "overdue">();
});

it("composed filters never widen the row type", () => {
  expectTypeOf(needsAttention).parameter(0).toEqualTypeOf<string>();
  expectTypeOf<ReturnType<typeof needsAttention>>().toEqualTypeOf<Loan[]>();
});
