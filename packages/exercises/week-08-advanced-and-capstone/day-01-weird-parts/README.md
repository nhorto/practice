# Day 1 — The Weird Parts

**Time:** ~90 min · **Reading:** [Total TypeScript — The Weird Parts of TypeScript](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/12-the-weird-parts.md)

Final week. Today is about the corners of the type system that surprise even
experienced TS devs — the places where TypeScript's structural model produces
behavior that *looks* wrong until you know the rule behind it.

## Goals

By the end of today you can, without looking anything up:

- Predict exactly when excess property checking fires (fresh literals) and when
  it silently doesn't (intermediate variables) — and use `satisfies` to close
  the gap
- Explain why a callback with *fewer* parameters is assignable where more are
  expected, and why one demanding *more* is rejected
- Explain why calling a union of functions requires an argument assignable to
  *every* member (the intersection of their parameters)
- Spot an "evolving `any`" empty array and shut it down with an annotation
- Choose correctly between `{}`, `object`, and `Record<string, never>`

## Warm-up (5 min)

Type these out from memory and predict which lines error before you check:

```ts
type Opts = { id: string };
const direct = ((o: Opts) => o)({ id: "a", extra: 1 }); // error? yes — fresh literal
const indirect = { id: "a", extra: 1 };
((o: Opts) => o)(indirect);                             // error? no — already widened

const nums = [1, 2, 3].map(() => 0);                    // fewer params: fine
```

## Exercises

```bash
pnpm exercise 08-01        # all of today's exercises
pnpm exercise 08-01 3      # just exercise 03
```

1. `01-excess-property-checks` — where the check fires, where it doesn't, and `satisfies`
2. `02-function-assignability` — fewer params OK, more params rejected
3. `03-unions-of-functions` — calling a union means satisfying every member
4. `04-empty-types` — evolving `any` arrays; `{}` vs `object` vs `Record<string, never>`

## The TS-dev mindset for today

- **Excess property checking is a lint, not a law.** It only guards fresh
  object literals. The moment a value passes through a variable, structural
  typing takes over and extra keys flow through silently. `satisfies` is how
  you ask for the strict check *and* keep the inferred type.
- **Functions are compared by what callers can do with them**, not by matching
  signatures token-for-token. A callback that ignores arguments is always safe.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
