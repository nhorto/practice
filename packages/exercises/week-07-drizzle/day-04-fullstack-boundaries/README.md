# Day 4 — Full-stack Boundaries: unknown → Zod → Drizzle → Result

**Time:** ~60–90 min · **Reading:** [Zod docs](https://zod.dev) · [Drizzle — Overview](https://orm.drizzle.team/docs/overview)

## Goals

By the end of today you can, without looking anything up:

- Write a Zod schema whose `z.infer` lines up with a table's `$inferInsert`
  (and prove it with `toExtend`)
- Explain why FormData needs `z.coerce` and where coercion belongs
- Return a discriminated `Result` from a validation step instead of throwing
  or returning "optional soup"
- Type a server-action-shaped function end to end:
  `unknown → parsed input → insert → Result<Row, string[]>`

## Warm-up (5 min)

Type this out from memory — don't copy/paste:

```ts
const input = z.object({
  email: z.email(),
  rating: z.coerce.number().int().min(1).max(5),
});

type Result<T, E> = { ok: true; value: T } | { ok: false; errors: E };

// The boundary contract, in one line:
const toRow = (data: z.infer<typeof input>): typeof feedback.$inferInsert => data;
```

## The shape of a boundary

Every server action in project 05 follows the same four steps:

1. **Receive `unknown`.** FormData, JSON body, whatever — you don't trust it.
2. **Parse with Zod.** `safeParse`, never `parse`-and-throw. The schema is
   written so its output type *extends* the table's `$inferInsert`.
3. **Hit the database.** The parsed data flows straight into
   `db.insert(...).values(parsed.data)` — no casts, because step 2 lined the
   types up.
4. **Return a discriminated `Result`.** The caller `if (result.ok)`-narrows;
   there is no state where both `value` and `errors` exist.

Today's exercises build each step, then compose them. The db parts stay
type-only (`declare const db`) — the *flow* is what you're practicing.

## Exercises

```bash
pnpm exercise 07-04        # all of today's exercises
pnpm exercise 07-04 3      # just exercise 03
```

1. `01-zod-mirrors-the-table` — a schema whose output type extends `$inferInsert`
2. `02-result-shapes` — discriminated `Result` vs optional soup
3. `03-server-action-flow` — compose: coerce, validate, insert, Result

## The TS-dev mindset for today

- **Two sources of truth meet at the boundary — make them shake hands.** The
  table owns the storage shape; the Zod schema owns the wire shape. The
  handshake is `z.infer<typeof schema> extends $inferInsert`, checked by the
  compiler, not by hope.
- **`ok` is the discriminant.** `{ value?, errors? }` forces callers to
  guess; `{ ok: true, value } | { ok: false, errors }` lets `if (r.ok)` do
  the narrowing. This is the same discriminated-union drill from week 2 —
  now guarding a database.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
