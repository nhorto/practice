# Day 3 — Overloads, Type Predicates & Assertion Functions

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — The Utils Folder](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/16-the-utils-folder.md)

## Goals

By the end of today you can, without looking anything up:

- Write function overloads so each call signature gets its own return type
- Explain why the implementation signature must cover every overload
- Write a type predicate (`value is T`) and use it with `if` and `.filter`
- Write an assertion function (`asserts value is T`) and say how it differs
  from a predicate
- Guard a completely `unknown` value into a typed object, honestly

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
function first(x: string): number;
function first(x: number): string;
function first(x: string | number): string | number {
  return typeof x === "string" ? x.length : String(x);
}

const isNumber = (value: unknown): value is number => typeof value === "number";

function assertPresent<T>(value: T | undefined): asserts value is T {
  if (value === undefined) throw new Error("missing");
}
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 03-03        # all of today's exercises
pnpm exercise 03-03 4      # just exercise 04
```

1. `01-overloads` — one function, several precise call signatures
2. `02-type-predicates` — `value is T` teaches `if` and `.filter` to narrow
3. `03-assertion-functions` — `asserts value is T` narrows by throwing
4. `04-guarding-unknown` — parse untrusted data into a typed shape

## The TS-dev mindset for today

- **Overloads are for callers.** The union signature is true but useless —
  `string | number` forces every caller to narrow again. Overloads move that
  work into the function, once.
- **A predicate returning plain `boolean` is a lie of omission.** You checked
  the type — `value is T` is how you tell the compiler what you learned.
- **Predicate = ask, assertion = insist.** `isString(x)` gives you a branch;
  `assertString(x)` throws, and everything after the call is the happy path.
- **At trust boundaries (JSON, APIs), `as` is wishful thinking.** A guard
  that actually checks each property is the honest version.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
