# Day 3 — Unions, Literals & Narrowing

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Unions, Literals and Narrowing](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/05-unions-literals-and-narrowing.md)

## Goals

By the end of today you can, without looking anything up:

- Type a value that can be "this OR that" with a union (`string | number`, `string | null`)
- Use literal types (`"asc" | "desc"`) instead of `string` to make invalid input impossible
- Explain why `const` infers a literal type but `let` widens to `string`
- Narrow a union inside a function with `typeof`, truthiness, and the `in` operator

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
type Direction = "asc" | "desc";
const label = (id: string | number) =>
  typeof id === "number" ? `#${id}` : id;
const hasEmail = (c: { email: string } | { phone: string }) => "email" in c;
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 01-03        # all of today's exercises
pnpm exercise 01-03 2      # just exercise 02
```

1. `01-union-types` — this OR that, including `| null`
2. `02-literal-types` — `"asc" | "desc"` beats `string`; `const` vs `let` inference
3. `03-narrowing-typeof` — one branch per member of the union
4. `04-narrowing-truthiness-and-in` — `if (value)` and `"key" in obj`

## The TS-dev mindset for today

- **Unions describe reality.** If a value can genuinely be `null`, put `| null`
  in the type and let the compiler force every caller to deal with it. That's
  a feature, not friction.
- **Make illegal states unrepresentable.** `direction: string` accepts
  `"sideways"`. `direction: "asc" | "desc"` makes the bug impossible to write.
- **Narrowing is just JavaScript.** `typeof`, `if (x)`, `"key" in x` — TypeScript
  watches your ordinary runtime checks and shrinks the type in each branch.
  Hover the value inside each branch and watch the union melt away.

## Today's build (~30 min)

**Project 01 — CLI Task Tracker** · [`projects/01-cli-task-tracker`](../../../../projects/01-cli-task-tracker/GUIDE.md)

**Milestone 1** — model the domain, write the pure core. This is the project kickoff: read the guide's intro first.

```bash
pnpm --filter project-cli-task-tracker test
```

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
