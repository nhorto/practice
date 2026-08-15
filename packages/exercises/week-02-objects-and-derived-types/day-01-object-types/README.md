# Day 1 — Object Types

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Objects](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/06-objects.md)

## Goals

By the end of today you can, without looking anything up:

- Build object hierarchies with `interface extends` — and explain why it beats
  `&` intersections (loud errors on clashes vs. silent `never`)
- Describe open-ended key/value data with an index signature
- Use `Record<Keys, Value>` for a *fixed* set of keys, and say when it beats an
  index signature
- Predict when an indexed read is `T | undefined` (`noUncheckedIndexedAccess`)

## Warm-up (5 min)

Open the [web playground](http://localhost:3000/playground) (or just a scratch file) and type these out from memory — don't copy/paste:

```ts
interface Animal { name: string }
interface Dog extends Animal { breed: string }
type WordCounts = { [word: string]: number };
type Flags = Record<"darkMode" | "beta", boolean>;
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 02-01        # all of today's exercises
pnpm exercise 02-01 2      # just exercise 02
```

1. `01-interface-extends` — combine object types; see why `extends` beats `&`
2. `02-index-signatures` — open-ended keys, honest `undefined` handling
3. `03-record-types` — a closed `Record` catches what an index signature lets slip

## The TS-dev mindset for today

- **Clashes should be loud.** An intersection quietly turns a conflicting
  property into `never`; `interface extends` refuses to compile and points at
  the property. Prefer the tool that fails at the declaration, not three files
  away.
- **Index signature = "any string key". `Record<Union, T>` = "exactly these
  keys, all present."** Reach for `Record` whenever you can name the keys — the
  compiler then enforces completeness for free.

## Today's build (~30 min)

**Project 01 — CLI Task Tracker** · [`projects/01-cli-task-tracker`](../../../../projects/01-cli-task-tracker/GUIDE.md)

Wrap up **milestone 2**, start **milestone 3** — JSON persistence with hand-rolled narrowing.

```bash
pnpm --filter project-cli-task-tracker test
```

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
