# Day 2 — Composing Schemas

**Time:** ~60–90 min · **Reading:** [Zod — Defining schemas](https://zod.dev/api) · [Total TypeScript Essentials — Unions and Narrowing](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/06-unions-and-narrowing.md)

## Goals

By the end of today you can, without looking anything up:

- Model "one of several shapes" with `z.union` and, when there's a tag field, `z.discriminatedUnion`
- Describe collections with `z.array` and `z.record(keySchema, valueSchema)` (two args in v4)
- Build one schema from another with `.extend()`
- Pick the right unknown-key policy: `z.strictObject` (reject) vs `z.object` (strip) vs `z.looseObject` (keep)
- Say exactly what `.optional()`, `.nullable()`, and `.nullish()` each infer to

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```ts
import { z } from "zod";

const Shape = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("circle"), radius: z.number() }),
  z.object({ kind: z.literal("square"), side: z.number() }),
]);
const Counts = z.record(z.string(), z.number());
const WithNick = z.object({ name: z.string(), nick: z.string().optional() });
```

## Exercises

```bash
pnpm exercise 05-02        # all of today's exercises
pnpm exercise 05-02 3      # just exercise 03
```

1. `01-discriminated-unions` — tag payment events and switch over them exhaustively
2. `02-arrays-and-records` — a cart of items and a sku → stock lookup table
3. `03-extend-and-strictness` — grow a schema with `.extend()`, then choose strict/strip/loose
4. `04-optional-and-nullable` — missing key vs explicit `null` vs either

## The TS-dev mindset for today

- **Schemas compose like types.** Everything you did in week 2 with union
  types has a runtime twin: `z.union` is `|`, `z.discriminatedUnion` is your
  tagged union, and the parsed value narrows in a `switch` exactly the same
  way — down to the exhaustive `never` default.
- **`z.object` strips by default.** Unknown keys silently disappear. That's
  usually what you want at a boundary — but say it out loud when you pick it,
  and reach for `strictObject` when extra keys mean a bug.
- **`optional` ≠ `nullable`.** A missing key and an explicit `null` are
  different wire formats. Match the schema to what the data source actually
  sends, not to what's convenient.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
