/**
 * Exercise 02 — where + eq/and/or: the schema types your filters
 *
 * `eq(loans.id, value)` checks `value` against the COLUMN's type. That means
 * badly-typed parameters and typo'd enum values are compile errors — but only
 * if you let the types flow from the schema instead of writing `string`
 * everywhere.
 *
 * NOTE: `db` is type-only and these functions are never called at runtime.
 *
 * 🎯 Three fixes, no changes to the tests or the table:
 *    1. `findLoan` — ids are numbers; fix the parameter type.
 *    2. `loansByStatus` — derive the status union from the column with
 *       `(typeof loans.status.enumValues)[number]` instead of `string`.
 *    3. `needsAttention` — "late" is not a status this schema knows about;
 *       the compiler is telling you the real name.
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

const schema = { loans };
declare const db: BetterSQLite3Database<typeof schema>;

// ❌ the id arrived as a string (URL params always do) — convert at the
// boundary, keep the query numeric.
const findLoan = (id: string) =>
  db.select().from(loans).where(eq(loans.id, id)).all();

// ❌ `string` is too loose — the column knows its exact union.
const loansByStatus = (status: string) =>
  db.select().from(loans).where(eq(loans.status, status)).all();

// ❌ one of these statuses doesn't exist.
const needsAttention = (member: string) =>
  db
    .select()
    .from(loans)
    .where(
      and(
        eq(loans.memberName, member),
        or(eq(loans.status, "active"), eq(loans.status, "late")),
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
