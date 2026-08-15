/**
 * Exercise 03 — .returning(): get typed rows back from writes
 *
 * A write executed with `.run()` only gives you driver metadata (rows
 * changed, last id). To get actual rows back — fully typed, and narrowable
 * with the same partial-select shape you used in exercise 01 — you chain
 * `.returning(...)` first, then execute with `.all()`. Someone here reached
 * straight for `.all()`, and Drizzle's types refuse: read the
 * `$drizzleTypeError` message in the test output — the library spells out
 * the fix.
 *
 * NOTE: `db` is type-only and these functions are never called at runtime.
 *
 * 🎯 Add `.returning(...)` to each write so the return types match the tests:
 *    - `createNote` returns the full inserted rows
 *    - `pinNote` returns only `{ id, pinned }` of the updated rows
 *    - `removeNote` returns the full deleted rows
 */
import { expect, expectTypeOf, it } from "vitest";
import { eq } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

const schema = { notes };
declare const db: BetterSQLite3Database<typeof schema>;

const createNote = (draft: NewNote) => db.insert(notes).values(draft).all();

const pinNote = (id: number) =>
  db.update(notes).set({ pinned: true }).where(eq(notes.id, id)).all();

const removeNote = (id: number) =>
  db.delete(notes).where(eq(notes.id, id)).all();

// --- tests ------------------------------------------------------------------

it("pinned defaults to false in the schema", () => {
  expect(notes.pinned.default).toBe(false);
});

it("insert ... returning yields the full inserted rows", () => {
  expectTypeOf<ReturnType<typeof createNote>>().toEqualTypeOf<Note[]>();
});

it("update ... returning can narrow to just the columns you need", () => {
  expectTypeOf<ReturnType<typeof pinNote>>().toEqualTypeOf<
    { id: number; pinned: boolean }[]
  >();
});

it("delete ... returning yields the rows that were removed", () => {
  expectTypeOf<ReturnType<typeof removeNote>>().toEqualTypeOf<Note[]>();
});
