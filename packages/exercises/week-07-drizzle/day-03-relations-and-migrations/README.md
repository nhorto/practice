# Day 3 — Relations, Relational Queries & Migrations

**Time:** ~60–90 min · **Reading:** [Drizzle — Relations](https://orm.drizzle.team/docs/relations) · [Relational queries (RQB)](https://orm.drizzle.team/docs/rqb) · [drizzle-kit overview](https://orm.drizzle.team/docs/kit-overview)

## Goals

By the end of today you can, without looking anything up:

- Add a foreign key with `.references(() => other.id)` (plus `onDelete`)
  and explain what it changes at the type level vs the database level
- Declare `relations()` in both directions (`one` / `many`) and explain why
  Drizzle needs them *in addition to* foreign keys
- Predict the result type of `db.query.t.findMany({ with: { ... } })`,
  including nested `columns:` narrowing
- Derive a "row + its children" type from a query instead of hand-writing it

## Warm-up (5 min)

Type this out from memory — don't copy/paste:

```ts
import { relations } from "drizzle-orm";

export const authors = sqliteTable("authors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorId: integer("author_id").notNull().references(() => authors.id),
});

export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(posts),
}));
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(authors, { fields: [posts.authorId], references: [authors.id] }),
}));
```

## Migrations with drizzle-kit (read this, no exercise)

Your schema file is the source of truth — drizzle-kit turns it into SQL. The
workflow you'll use for real in [project 05](../../../../projects/05-fullstack-notes):

- **`drizzle-kit generate`** — diffs your schema against the previous
  snapshot and writes a numbered `.sql` migration file. Commit these.
- **`drizzle-kit migrate`** — applies pending migration files to the
  database, recording which ones have run.
- **`drizzle-kit push`** — skips migration files entirely and force-syncs the
  database to the schema. Great for local prototyping, wrong for production
  (no history, can drop data).
- **`drizzle-kit studio`** — a local GUI to browse the database with your
  schema's types.

The mental model: *generate/migrate* is source-controlled schema history;
*push* is "make it look like my code, now". Nothing here changes your
TypeScript types — those always come straight from `sqliteTable`.

## Exercises

```bash
pnpm exercise 07-03        # all of today's exercises
pnpm exercise 07-03 2      # just exercise 02
```

1. `01-references` — foreign keys with `.references()` and what they do to types
2. `02-declare-relations` — `relations()` in both directions unlocks `with:`
3. `03-nested-result-types` — derive the shape of a nested relational query

## The TS-dev mindset for today

- **A foreign key is a database constraint; a relation is a type-level map.**
  `.references()` makes the DB enforce integrity. `relations()` tells the
  relational query builder what `with: { posts: true }` should even mean.
  You usually want both — and today's exercise 02 shows what breaks when you
  declare neither.
- **Nested results are still "derive, don't declare".** The type of a card
  with its children is `Awaited<ReturnType<typeof query>>[number]` — never a
  hand-written interface that quietly drifts from the query.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
