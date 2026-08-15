/**
 * Scratch 4: what do writes type as WITHOUT .returning()?
 */
import { expectTypeOf, it } from "vitest";
import { eq } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
});

const schema = { notes };
declare const db: BetterSQLite3Database<typeof schema>;

const a = (body: string) => db.insert(notes).values({ body }).all();
const b = (id: number) => db.update(notes).set({ body: "x" }).where(eq(notes.id, id)).all();
const c = (id: number) => db.delete(notes).where(eq(notes.id, id)).all();
const d = (id: number) => db.delete(notes).where(eq(notes.id, id)).run();

// --- tests ------------------------------------------------------------------

it("what are these", () => {
  expectTypeOf<ReturnType<typeof a>>().toEqualTypeOf<never[]>();
  expectTypeOf<ReturnType<typeof b>>().toEqualTypeOf<never[]>();
  expectTypeOf<ReturnType<typeof c>>().toEqualTypeOf<never[]>();
  expectTypeOf<ReturnType<typeof d>>().not.toBeAny();
});
