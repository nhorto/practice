# Day 3 — Enums & the Weird Parts

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — TypeScript-only Features](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/09-typescript-only-features.md) · [The Weird Parts](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/12-the-weird-parts.md)

## Goals

By the end of today you can, without looking anything up:

- Convert an enum to an `as const` object + derived union, and argue why
- Explain when excess property checking fires — and the intermediate-variable
  loophole that turns it off
- Say what `{}` really means, and pick correctly between `{}`, `object`,
  `unknown`, and `Record<string, unknown>`
- Explain why `Object.keys` returns `string[]` and write the typed helper for
  when you know better

## Warm-up (5 min)

Type this out from memory — it's the pattern of the day:

```ts
const LogLevel = { Debug: "debug", Info: "info", Error: "error" } as const;
type LogLevel = (typeof LogLevel)[keyof typeof LogLevel]; // "debug" | "info" | "error"
```

One name, two worlds: `LogLevel` the value and `LogLevel` the type.

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all
tests and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 04-03        # all of today's exercises
pnpm exercise 04-03 2      # just exercise 02
```

1. `01-enum-to-as-const` — delete an enum, keep the ergonomics
2. `02-excess-property-checks` — the typo-catcher and its loophole
3. `03-the-empty-object-type` — `{}` accepts almost everything
4. `04-object-keys-reality` — why `Object.keys` is `string[]`, and the helper

## The TS-dev mindset for today

- **No enums.** They're a runtime feature with nominal typing bolted on —
  numeric ones aren't even type-safe. `as const` + a derived union gives the
  same DX with none of the weirdness, and survives `isolatedModules`/
  erasable-syntax futures.
- **Excess property checks are a courtesy, not a guarantee.** They only fire
  on fresh literals. If correctness matters, annotate (or `satisfies`) the
  variable — don't rely on the call site.
- **Weirdness usually protects you.** `{}` and `Object.keys` feel wrong until
  you see the structural-typing reason. Learn the reason; then break the rule
  deliberately in one named helper, not ad hoc.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
