# Day 5 — Branded Types & Designing Your Types

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Designing Your Types](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/15-designing-your-types.md)

## Goals

By the end of today you can, without looking anything up:

- Write a branded type (`string & { readonly __brand: "UserId" }`) and
  explain how it fakes nominal typing in a structural system
- Write a constructor function that validates and *then* brands — and say why
  the `as` inside it is earned
- Argue where brands pay off: ids that must not be mixed up, units
  (cents vs dollars), validated strings (emails, slugs)
- Do all of this week's moves from memory (review drill)

## The idea (read before the exercises)

`type UserId = string` is documentation, not protection — structurally it IS
`string`, and every other string-alias too. Add a phantom property and the
alias becomes effectively nominal:

```ts
type UserId = string & { readonly __brand: "UserId" };
```

No runtime value ever has `__brand` — the intersection is unconstructable by
honest means. That's the point: the *only* way in is a constructor that
`as`-serts, and the constructor is where you put validation. Holding a
branded value is then a compile-time *proof* that validation happened.
Zod can generate these for you (`.brand()` — you'll meet it in week 5); today
you build them by hand so you know what's underneath.

## Warm-up (5 min)

Type the full pattern from memory:

```ts
type Slug = string & { readonly __brand: "Slug" };
const slug = (raw: string): Slug => {
  if (!/^[a-z0-9-]+$/.test(raw)) throw new Error(`Bad slug: ${raw}`);
  return raw as Slug;
};
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all
tests and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 04-05        # all of today's exercises
pnpm exercise 04-05 2      # just exercise 02
```

1. `01-branding-basics` — make `UserId` and `PostId` un-mixable
2. `02-validate-then-brand` — an `Email` that proves it was checked
3. `03-ids-at-the-boundaries` — accounts and money: swap-proof signatures
4. `04-review-drill` — the whole week in one file

## The TS-dev mindset for today

- **A brand is a proof, not a string.** Design functions to *demand the
  proof* (`to: Email`) instead of re-validating raw primitives everywhere.
- **One door in.** Exactly one constructor per brand owns the `as`. If `as
  Email` appears twice in a codebase, one of them is a bug waiting.
- **Brand at the boundary.** Parse and brand where data enters (API, DB,
  user input); the entire interior of the app then works with proven types.

## Done?

Week 4 complete — check the day off in the [dashboard](http://localhost:3000).
Next week: Zod, where these hand-built guarantees start coming from schemas.
