# Day 5 — Tooling & Week 1 Review

**Time:** ~60–90 min · **Reading:** [Setup](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/01-setup-typescript.md) · [IDE Superpowers](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/02-ide-superpowers.md) · [TypeScript in the Development Pipeline](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/03-typescript-in-the-development-pipeline.md)

## Goals

By the end of today you can, without looking anything up:

- Explain what `tsc` does, what `--noEmit` changes, and why CI runs `tsc --noEmit`
- Describe the two-lane pipeline: who strips the types vs. who checks them
- Use hover, autocomplete, go-to-definition, and rename-symbol on purpose
- Solve mixed problems using everything from days 1–4 without peeking

## Part 1 — Tooling walkthrough (~25 min)

Today starts hands-on with the tools instead of new syntax. Work through this
in order, from `packages/exercises`.

### 1. `tsc` is two tools in one

The TypeScript compiler does two independent jobs: **checking** types and
**emitting** JavaScript. Prove they're independent — create a scratch file
`/tmp/demo.ts` containing `const n: number = "oops";` and run:

```bash
pnpm exec tsc /tmp/demo.ts --outDir /tmp/demo-out
cat /tmp/demo-out/demo.js
```

The check FAILED (you saw the error) — yet `demo.js` exists, with the types
stripped. Emitting doesn't require the check to pass.

### 2. `--noEmit`: check only, emit nothing

In an app, you almost never want `tsc`'s JavaScript output — a bundler
(Vite/esbuild/swc) produces it faster and never looks at your types. So we
run `tsc` purely as a type checker:

```bash
pnpm typecheck        # runs: tsc --noEmit -p tsconfig.solutions.json
```

This is the command CI runs. The pipeline has two lanes:

- **Dev/build lane** — Vite/esbuild *strip* types and produce JS. Fast, no
  checking at all. A type error won't stop your dev server.
- **Check lane** — `tsc --noEmit` (and your IDE, which is the same checker
  running in-process) verifies the types. This is the lane that fails CI.

That's also why this package's tests run `vitest --typecheck`: runtime
assertions and type assertions in one loop.

### 3. IDE superpowers (5 drills, ~2 min each)

Open yesterday's `03-fetch-states.solution.ts` and try each of these:

1. **Hover** `state` inside each `case` — watch the union narrow per branch.
2. **Autocomplete** — inside `renderState`, type `state.` and see only the
   properties of the narrowed member.
3. **Go to definition** (F12 / cmd-click) on `RequestState` — jump straight
   to the alias, then use "Go back".
4. **Rename symbol** (F2) on `renderState` — every usage updates, including
   in the tests. Undo it.
5. **Quick fix** (cmd-. / ctrl-.) — delete a `case` and let the error on
   `unhandled: never` guide you; try the suggested fixes, then restore.

## Part 2 — Review exercises

No new concepts — everything below is days 1–4 combined, slightly harder.

```bash
pnpm exercise 01-05        # all of today's exercises
pnpm exercise 01-05 2      # just exercise 02
```

1. `01-inventory-report` — literal unions + tuples + optional properties
2. `02-command-parser` — `unknown`-ish input, narrowing, discriminated result
3. `03-settings-events` — rest params + exhaustive switch + `never`

## The TS-dev mindset for today

- **The red squiggle and CI failure are the same program.** Your editor runs
  `tsc`'s checker continuously; `tsc --noEmit` in CI is just the batch
  version. Green editor = green CI, no surprises.
- **Trust the tooling loop.** When a type error looks confusing, hover the
  values involved and read the actual inferred types instead of guessing.

## Done?

That's week 1. Check the day off in the [dashboard](http://localhost:3000),
then take a break — week 2 goes deeper into objects and type manipulation.
