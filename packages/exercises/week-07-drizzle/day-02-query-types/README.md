# Day 2 — Query Types: select, where, returning

**Time:** ~60–90 min · **Reading:** [Drizzle — Select](https://orm.drizzle.team/docs/select) · [Filter & conditional operators](https://orm.drizzle.team/docs/operators) · [Insert](https://orm.drizzle.team/docs/insert) · [Update](https://orm.drizzle.team/docs/update) · [Delete](https://orm.drizzle.team/docs/delete)

## Goals

By the end of today you can, without looking anything up:

- Predict the row type of `db.select().from(t)` vs a partial
  `db.select({ a: t.a })` — including renamed keys
- Use `eq`, `and`, `or` and explain why `eq(t.col, value)` type-checks
  `value` against the *column's* type
- Derive a function's parameter types from the schema
  (`(typeof t.col.enumValues)[number]`, `Partial<typeof t.$inferInsert>`)
- Add `.returning()` (full or partial) to insert/update/delete and state the
  exact result type

## Warm-up (5 min)

Type this out from memory — don't copy/paste:

```ts
import { eq, and, or } from "drizzle-orm";

const rows = () => db.select({ id: users.id, name: users.name }).from(users).all();
// typeof rows -> () => { id: number; name: string }[]

const created = (draft: typeof users.$inferInsert) =>
  db.insert(users).values(draft).returning().all();
// typeof created -> (draft: NewUser) => User[]
```

## A note on how today's exercises run

There is **no live database** in this package. Every file declares a typed
handle — `declare const db: BetterSQLite3Database<typeof schema>` — and wraps
queries in functions that are **never called at runtime**. The tests assert on
`ReturnType<...>` and parameter types only. This is the point: Drizzle's
value is that the *types* flow, and you can verify that without a single
connection string.

## Exercises

```bash
pnpm exercise 07-02        # all of today's exercises
pnpm exercise 07-02 3      # just exercise 03
```

1. `01-partial-selects` — how the select shape becomes the row type
2. `02-where-and-operators` — `eq`/`and`/`or`, and deriving parameter types from columns
3. `03-returning-rows` — `.returning()` on insert/update/delete
4. `04-typed-patches` — a derived `Partial` patch type for updates

## The TS-dev mindset for today

- **The query is the type.** You never annotate what a query returns — you
  *read* it off the query. If the type is wrong, fix the query (or the
  schema), never the annotation.
- **Parameters flow backwards from the schema.** A function that filters by
  status should take `(typeof loans.status.enumValues)[number]`, not
  `string`. Then a typo'd status is a compile error, not an empty result set
  at 2am.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
