# Day 3 — Type-Challenges Workout

**Time:** ~90 min · **Reading:** [type-challenges](https://github.com/type-challenges/type-challenges) — skim the easy/medium lists; today's five are drawn from them

Today is a pure type-level workout: rebuild five famous utilities from scratch
using the raw machinery — mapped types, `keyof`, indexed access, conditional
types, `infer`, and recursion. No runtime cleverness can save you; the type
system is the whole game.

## Goals

By the end of today you can, without looking anything up:

- Write a mapped type over a union of keys (`MyPick`)
- Extract a type from a position with `infer` (`MyReturnType`)
- Index a tuple with `[number]` to union its members (`TupleToUnion`)
- Recurse through nested objects in a conditional type (`DeepReadonly`)
- Flatten an intersection into one object type (`Prettify`) — and explain why
  that's ever needed

## Warm-up (5 min)

Type from memory:

```ts
type Keys = keyof { a: 1; b: 2 };                    // "a" | "b"
type Values<T> = T[keyof T];
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
```

## Exercises

```bash
pnpm exercise 08-03        # all of today's exercises
pnpm exercise 08-03 4      # just exercise 04
```

1. `01-my-pick` — rebuild `Pick` with a mapped type
2. `02-my-return-type` — rebuild `ReturnType` with `infer`
3. `03-tuple-to-union` — `T[number]` and `as const` tuples
4. `04-deep-readonly-and-prettify` — recursive conditionals + intersection flattening

## The TS-dev mindset for today

- **Type-level code is still code.** Mapped types are loops, conditional types
  are if-statements, `infer` is destructuring, recursion is recursion. Read
  `{ [P in K]: T[P] }` as "for each P in K, look up T[P]".
- **Test types like you test functions.** Every utility today is pinned by
  `expectTypeOf` assertions — write the type, watch red turn green, exactly
  like the runtime loop you've used for seven weeks.

## Today's build

No project today — type-challenges are the workout. The capstone kicks off on **day 5**.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
