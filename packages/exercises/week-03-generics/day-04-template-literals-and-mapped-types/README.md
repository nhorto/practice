# Day 4 — Template Literal Types & Mapped Types

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Designing Your Types](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/15-designing-your-types.md)

## Goals

By the end of today you can, without looking anything up:

- Write a template literal type (`` `/${string}` ``) to constrain string shapes
- Explain why `` `${Variant}-${Size}` `` expands to every combination
- Transform an object type with a mapped type (`[K in keyof T]`)
- Rename keys while mapping using `as` and `Capitalize`
- Drop keys during remapping by mapping them to `never`

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
type Route = `/${string}`;
type Flags<T> = { [K in keyof T]: boolean };
type Getters<T> = { [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K] };
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 03-04        # all of today's exercises
pnpm exercise 03-04 3      # just exercise 03
```

1. `01-template-literal-types` — strings with a required shape
2. `02-mapped-types` — rebuild an object type key by key
3. `03-key-remapping` — rename and drop keys with `as`
4. `04-css-variables` — derive CSS variable types from an `as const` palette

## The TS-dev mindset for today

- **`string` is often too big.** If every valid value starts with `/` or `#`,
  encode that — typos become compile errors instead of 404s.
- **A mapped type is a `for` loop over keys.** `[K in keyof T]` visits each
  key; what you write after `:` decides what each one becomes.
- **Derive, don't duplicate.** `Getters<T>` written by hand for one type is
  fine today and wrong after the next refactor. Written as a mapped type, it
  can never drift out of sync with `T`.

## Today's build (~30 min)

**Project 02 — ts-utils library** · [`projects/02-ts-utils-library`](../../../../projects/02-ts-utils-library/GUIDE.md)

**Milestone 4** — the typed event emitter, driven by an event map.

```bash
pnpm --filter project-ts-utils test
```

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
