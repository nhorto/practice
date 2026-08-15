# Day 1 — Type Annotations & Functions

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Essential Types and Annotations](https://www.totaltypescript.com/books/total-typescript-essentials/essential-types-and-annotations)

## Goals

By the end of today you can, without looking anything up:

- Annotate function parameters and return types
- Type objects, arrays, and optional properties inline
- Create and use `type` aliases
- Explain what TypeScript infers for you vs. what you must write yourself

## Warm-up (5 min)

Open the [web playground](http://localhost:3000/playground) (or just a scratch file) and type these out from memory — don't copy/paste:

```ts
const greet = (name: string): string => `Hello, ${name}`;
const scores: number[] = [90, 85, 72];
type User = { id: number; name: string; email?: string };
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 01-01        # all of today's exercises
pnpm exercise 01-01 2      # just exercise 02
```

1. `01-function-annotations` — annotate parameters and return types
2. `02-object-and-array-types` — object shapes, arrays, optional properties
3. `03-type-aliases` — extract reusable type aliases

## The TS-dev mindset for today

- **Let inference work.** `const x = 5` needs no annotation — TypeScript already
  knows. Annotate function *parameters* always (TS can't infer those), and
  return types when you want to lock in a contract.
- `any` is not an option. If you're stuck, `unknown` + narrowing is the escape
  hatch, never `any`.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
