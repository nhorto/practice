# Day 4 — Discriminated Unions

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Unions, Literals and Narrowing](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/05-unions-literals-and-narrowing.md) (second half)

## Goals

By the end of today you can, without looking anything up:

- Turn a "bag of optional properties" into a discriminated union
- Narrow a discriminated union by switching on its discriminant (`kind`, `type`, `status`)
- Write an exhaustive `switch` whose `default` assigns to `never` — and explain
  what breaks when a new union member appears
- Take an `unknown` input and safely produce a well-typed result

## Warm-up (5 min)

Open a scratch file and type this out from memory — don't copy/paste:

```ts
type State =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; message: string };

const render = (state: State): string => {
  switch (state.status) {
    case "loading":
      return "…";
    case "success":
      return state.data;
    case "error":
      return state.message;
    default: {
      const unhandled: never = state;
      throw new Error(`Unhandled: ${JSON.stringify(unhandled)}`);
    }
  }
};
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 01-04        # all of today's exercises
pnpm exercise 01-04 2      # just exercise 02
```

1. `01-discriminated-shapes` — replace optional-property soup with a real union
2. `02-exhaustive-switch` — the `never` default catches the missing case
3. `03-fetch-states` — model loading/success/error and render each one
4. `04-parsing-unknown` — from `unknown` input to a typed result

## The TS-dev mindset for today

- **Optional properties describe "maybe present". Discriminated unions describe
  "either this whole shape or that whole shape."** If you're writing `!` or
  `?? 0` to convince the compiler a property exists, the type is wrong — fix
  the type, not the call site.
- **`never` is your exhaustiveness alarm.** Assigning the switch's leftover
  value to `never` costs one line and turns "we forgot to handle the new case"
  from a production bug into a compile error.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
