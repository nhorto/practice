# Day 5 — Annotations vs. Assertions

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Annotations and Assertions](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/11-annotations-and-assertions.md)

## Goals

By the end of today you can, without looking anything up:

- Explain the difference: an annotation (`: T`) asks the compiler to CHECK,
  an assertion (`as T`) tells it to TRUST you
- Say where `as` is legitimate (`JSON.parse`, boundaries the compiler can't
  see past) and where it's a lie waiting to crash
- Use non-null `!` only when you can state WHY the value can't be null
- Reach for `satisfies` on configs: validate the shape without widening away
  the keys and literals

## Warm-up (5 min)

Open the [web playground](http://localhost:3000/playground) (or just a scratch file) and type these out from memory — don't copy/paste:

```ts
type Config = { retries: number };
const a: Config = { retries: 3 }; // checked
const b = JSON.parse('{"retries":3}') as Config; // trusted
const first = "a b".split(" ")[0]!; // non-null: split never returns []
const routes = { home: "/" } satisfies Record<string, string>; // checked, not widened
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 02-05        # all of today's exercises
pnpm exercise 02-05 4      # just exercise 04
```

1. `01-as-vs-annotation` — an `as` that lied, and an `as` that's earned
2. `02-non-null-assertions` — `!` with a reason, never as a reflex
3. `03-satisfies-configs` — validate a config without widening it
4. `04-review-status-board` — review drill: the whole week in one exercise

## The TS-dev mindset for today

- **Prefer the tool that checks.** Annotation over assertion, narrowing over
  `!`, `satisfies` over `as` — reach for the trusting tool only at real
  boundaries (parsing, foreign data), and leave a comment saying why you
  know better than the compiler.
- **`satisfies` is the config workhorse**: `as` would silence mistakes,
  an annotation would forget which keys exist. `satisfies` catches the
  mistakes AND keeps the precise type.

## Done?

That's week 2. Check the day off in the [dashboard](http://localhost:3000) — next week: unions, narrowing, and `unknown` in anger.
