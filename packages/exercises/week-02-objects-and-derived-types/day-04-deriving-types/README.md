# Day 4 — Deriving Types

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Deriving Types](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/10-deriving-types.md)

## Goals

By the end of today you can, without looking anything up:

- Derive a type from a runtime value with `typeof`, and its key union with
  `keyof typeof`
- Reach into a type with indexed access: `Album["artist"]`,
  `Album["tracks"][number]`
- Derive function types with `ReturnType`, `Parameters`, and unwrap promises
  with `Awaited`
- Replace an enum with the `as const` object pattern:
  `(typeof X)[keyof typeof X]`

## Warm-up (5 min)

Open the [web playground](http://localhost:3000/playground) (or just a scratch file) and type these out from memory — don't copy/paste:

```ts
const config = { retries: 3, verbose: true };
type Config = typeof config;
type ConfigKey = keyof typeof config; // "retries" | "verbose"
type Retries = Config["retries"]; // number

const STATUS = { Open: "open", Closed: "closed" } as const;
type Status = (typeof STATUS)[keyof typeof STATUS]; // "open" | "closed"
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 02-04        # all of today's exercises
pnpm exercise 02-04 4      # just exercise 04
```

1. `01-typeof-and-keyof-typeof` — one runtime object, zero hand-written types
2. `02-indexed-access` — pull nested types out instead of re-declaring them
3. `03-returntype-parameters-awaited` — derive from functions you don't control
4. `04-no-enums` — the `as const` object pattern that replaces `enum`

## The TS-dev mindset for today

- **Derive, don't declare.** If a type describes something that already
  exists — a config object, a function's return value, a field of another
  type — write `typeof` / `keyof` / `T["key"]` / `ReturnType` and let the
  compiler keep it in sync forever. Every problem today is a hand-written
  copy that drifted; every solution deletes the copy.
- **No enums, ever, in this codebase.** `as const` object +
  `(typeof X)[keyof typeof X]` gives you the same autocomplete and safety
  with plain objects and plain strings — no special runtime emit, no
  assignability weirdness.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
