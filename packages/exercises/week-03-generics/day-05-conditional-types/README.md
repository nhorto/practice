# Day 5 — Conditional Types & Week Review

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Designing Your Types](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/15-designing-your-types.md)

## Goals

By the end of today you can, without looking anything up:

- Write a conditional type (`T extends X ? A : B`) and read one back in English
- Pull a type out of another with `infer`
- Explain distributivity: why `Exclude<"a" | "b", "a">` visits each member
- Rebuild `Extract` and `Exclude` from scratch
- Combine everything from this week in one typed API

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
type IsString<T> = T extends string ? true : false;
type ElementOf<T> = T extends (infer E)[] ? E : never;
type Without<T, U> = T extends U ? never : T;
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 03-05        # all of today's exercises
pnpm exercise 03-05 4      # just exercise 04
```

1. `01-conditional-basics` — `extends ? :` — an if/else for types
2. `02-infer` — capture a piece of a type and reuse it
3. `03-distributivity` — conditions map over each union member
4. `04-review-event-emitter` — the whole week in one exercise

## The TS-dev mindset for today

- **Read `extends` as "is assignable to".** `T extends string ? A : B` asks
  "would a T fit in a string-shaped hole?" — nothing more.
- **`infer` is pattern matching.** "If T looks like `Promise<something>`,
  call that something `V` and hand it to me."
- **Distributivity is the secret power.** A conditional type applied to
  `A | B | C` runs once per member — that's the entire implementation of
  `Exclude`, `Extract`, and half the standard library.

## Done?

That's the week — generics, generic types, overloads, guards, template
literals, mapped types, and conditional types. Check the day off in the
[dashboard](http://localhost:3000) and skim next week's README.
