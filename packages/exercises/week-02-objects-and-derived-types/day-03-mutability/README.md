# Day 3 — Mutability

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Mutability](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/07-mutability.md)

## Goals

By the end of today you can, without looking anything up:

- Explain why `let x = "GET"` is `string` but `const x = "GET"` is `"GET"`
  (widening), and fix a widened `let` with an annotation
- Mark properties `readonly` and know it's a compile-time-only guarantee
- Accept `readonly T[]` in functions that don't mutate — and copy before
  sorting
- Freeze a value's inferred type with `as const` (literal values, readonly
  props, tuples)

## Warm-up (5 min)

Open the [web playground](http://localhost:3000/playground) (or just a scratch file) and type these out from memory — don't copy/paste:

```ts
const method = "GET"; // type: "GET"
let verb = "GET"; // type: string
type Config = { readonly baseUrl: string };
const sum = (nums: readonly number[]) => nums.reduce((a, b) => a + b, 0);
const ROUTES = { home: "/" } as const;
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 02-03        # all of today's exercises
pnpm exercise 02-03 4      # just exercise 04
```

1. `01-let-vs-const-widening` — why `let` widens, and the two ways to fix it
2. `02-readonly-properties` — lock identity fields, leave counters mutable
3. `03-readonly-arrays` — a sort that stops eating its input
4. `04-as-const` — literal routes and a real tuple

## The TS-dev mindset for today

- **Mutability is part of the type.** `let` means "will be reassigned", so
  TypeScript widens to make reassignment possible. If you don't reassign,
  say `const`; if you do, annotate the `let` with the union you actually mean.
- **`readonly` costs nothing and catches real bugs** — `.sort()` and `.push()`
  on someone else's array being the classic. Accepting `readonly T[]` also
  makes your function callable with MORE arrays, not fewer.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
