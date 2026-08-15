# Day 1 — Generic Functions

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — The Utils Folder](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/16-the-utils-folder.md)

## Goals

By the end of today you can, without looking anything up:

- Write a generic function with one or more type parameters
- Explain how TypeScript infers type arguments from the values you pass in
- Constrain a type parameter with `extends` and say what that buys you
- Give a type parameter a default so callers can omit the type argument
- Spot when `unknown` parameters are silently throwing type information away

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
const identity = <T>(value: T): T => value;
const keysOf = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[];
const createSet = <T = string>() => new Set<T>();
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 03-01        # all of today's exercises
pnpm exercise 03-01 2      # just exercise 02
```

1. `01-make-it-generic` — turn string-only helpers into generic ones
2. `02-inference-from-arguments` — let type arguments flow in from the call site
3. `03-constraints` — `extends` tells the compiler what T can do
4. `04-defaults` — `=` gives T a fallback when there's nothing to infer

## The TS-dev mindset for today

- **A generic function is a deal:** "tell me nothing — I'll figure out `T` from
  your arguments and pay you back with precise return types." If callers ever
  *have* to write the type argument by hand, check your parameter types first.
- **`unknown` in, `unknown` out is a smell.** It type-checks, but the caller
  loses the connection between input and output. That connection is exactly
  what a type parameter preserves.
- **Constraints are for the function body.** Write the body, see what T needs
  to support (`.length`, a key, spreading), and put *only that* in the
  `extends` clause.

## Today's build (~30 min)

**Project 02 — ts-utils library** · [`projects/02-ts-utils-library`](../../../../projects/02-ts-utils-library/GUIDE.md)

**Milestone 1** — `groupBy` + `pick`/`omit`: generics that infer. Project kickoff.

```bash
pnpm --filter project-ts-utils test
```

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
