# Day 5 — Review & Project Focus

**Time:** ~30 min drills, then the project · **Reading:** [Project 05 — Full-stack notes app](../../../../projects/05-fullstack-notes)

## Today is a project day

The drills below are a warm-up. The real work of this week is
**[project 05 — the full-stack notes app](../../../../projects/05-fullstack-notes)**
(Next.js + Drizzle + Zod), where everything from days 1–4 happens against a
*live* database: you'll write the schema, run `drizzle-kit generate` and
`migrate` for real, and wire server actions end to end. Aim to spend most of
today's session there.

Before you start the project, check you can answer these from memory:

- How do I get the row/insert types from a table? Why never hand-write them?
- Which columns are optional in `$inferInsert`, and what makes them so?
- What does `.returning()` change about a write's type?
- Why does `with: { posts: true }` need `relations()` and not just a
  foreign key?
- Where does `z.coerce` belong, and what does the Zod schema's output type
  have to line up with?
- What are the four steps of a server-action boundary?

## Warm-up drills

```bash
pnpm exercise 07-05        # all of today's drills
pnpm exercise 07-05 3      # just drill 03
```

1. `01-schema-recall` — define a table from a spec, from memory
2. `02-boundary-drill` — Zod + Result in front of a table, from memory
3. `03-derive-everything` — the capstone drill: replace every hand-written
   type with a derived one

## The TS-dev mindset for this week

One sentence: **the `sqliteTable` call is the single source of truth, and
every other type in the stack — row, insert, patch, query result, Zod
handshake, action Result — is derived from it.** If you hand-write a type
anywhere in that chain, you've built a second source of truth that will
drift. That's "derive, don't declare" applied to the database, and it's the
habit project 05 is designed to cement.

## Today's build (~30 min)

**Project 05 — Full-stack notes** · [`projects/05-fullstack-notes`](../../../../projects/05-fullstack-notes/GUIDE.md)

**Milestone 5**, then **milestone 6** if there's time — pages through the data layer, then search + tags.

## Done?

Check the day off in the [dashboard](http://localhost:3000) — then go build
[project 05](../../../../projects/05-fullstack-notes).
