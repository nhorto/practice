# Day 1 — Drizzle Schemas & Type Inference

**Time:** ~60–90 min · **Reading:** [Drizzle — Overview](https://orm.drizzle.team/docs/overview) · [SQL schema declaration](https://orm.drizzle.team/docs/sql-schema-declaration) · [SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite)

## Goals

By the end of today you can, without looking anything up:

- Define a SQLite table with `sqliteTable`, `integer`, and `text`
- Apply `.primaryKey({ autoIncrement: true })`, `.notNull()`, and `.default()`
  — and predict how each one changes the inferred types
- Derive row types with `typeof table.$inferSelect` / `typeof table.$inferInsert`
  instead of hand-writing them
- Explain why a `.notNull().default()` column is required in the select type
  but optional in the insert type

## Warm-up (5 min)

Type this out from memory — don't copy/paste:

```ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  bio: text("bio"),
});

type User = typeof users.$inferSelect; // { id: number; name: string; bio: string | null }
type NewUser = typeof users.$inferInsert; // { id?: number; name: string; bio?: string | null }
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 07-01        # all of today's exercises
pnpm exercise 07-01 2      # just exercise 02
```

1. `01-first-table` — column modifiers: `.primaryKey()`, `.notNull()`, `.default()`
2. `02-derive-row-types` — replace drifted hand-written types with `$inferSelect`/`$inferInsert`
3. `03-shape-the-insert-type` — design the schema so the *insert* type has the ergonomics you want

## The TS-dev mindset for today

- **"Derive, don't declare" applies to the database too.** The `sqliteTable`
  call is the single source of truth — row types, insert types, and (later)
  Zod schemas and query results all *derive* from it. If you ever write
  `type User = { id: number; ... }` next to a Drizzle table, you've created a
  second source of truth that WILL drift.
- **Read the modifiers as type transformations.** `.notNull()` removes
  `| null`. `.primaryKey({ autoIncrement: true })` and `.default()` make the
  column *optional on insert* — the database can fill it in. That's why
  `$inferSelect` and `$inferInsert` differ.
- A table definition is plain JavaScript — no database needed. That's why
  today's tests can assert on `users.name.notNull` at runtime.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
