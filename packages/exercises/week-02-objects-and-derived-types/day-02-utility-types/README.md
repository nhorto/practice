# Day 2 — Utility Types

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Objects](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/06-objects.md) · [Deriving Types](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/10-deriving-types.md)

## Goals

By the end of today you can, without looking anything up:

- Derive smaller types from a source type with `Pick` and `Omit`
- Make everything optional with `Partial` (patches) and everything required
  with `Required` (resolved configs)
- Get a union of a type's keys with `keyof`
- Compose utilities — `Partial<Omit<T, "id">>` — instead of writing shapes by
  hand

## Warm-up (5 min)

Open the [web playground](http://localhost:3000/playground) (or just a scratch file) and type these out from memory — don't copy/paste:

```ts
type User = { id: string; name: string; email: string };
type Preview = Pick<User, "id" | "name">;
type WithoutId = Omit<User, "id">;
type Patch = Partial<User>;
type UserKey = keyof User; // "id" | "name" | "email"
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 02-02        # all of today's exercises
pnpm exercise 02-02 3      # just exercise 03
```

1. `01-pick-and-omit` — replace hand-copied types that already drifted
2. `02-partial-and-required` — patches take `Partial`, resolvers return `Required`
3. `03-keyof` — stop hand-maintaining a union of property names
4. `04-combining-utilities` — `Partial<Omit<...>>` for a safe update type

## The TS-dev mindset for today

- **One source of truth.** Every hand-copied shape is a drift waiting to
  happen (today's problems all contain real drift — find it). Derive with
  `Pick`/`Omit`/`Partial`/`keyof` and the copy can never disagree with the
  original.
- **Utilities compose.** `Partial<Omit<Article, "id">>` reads exactly like the
  rule it encodes: "any field may change, except the id".

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
