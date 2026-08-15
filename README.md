# TypeScript Dojo 🥋

A personal training ground for becoming fluent in TypeScript — not "TypeScript
written like Python", but TypeScript the way TypeScript devs write it: types
derived instead of declared, invalid states unrepresentable, `any` nowhere in
sight. Built around the patterns taught by Matt Pocock (Total TypeScript) and
the T3 community.

**The goal: 1–2 hours of hands-on-keyboard practice every day for 8 weeks.**
See [CURRICULUM.md](./CURRICULUM.md) for the full map.

## What's in here

| Path | What it is |
|------|-----------|
| [`CURRICULUM.md`](./CURRICULUM.md) | The 8-week, day-by-day plan |
| [`packages/exercises/`](./packages/exercises) | ~40 daily sessions of test-driven type drills (the core) |
| [`projects/`](./projects) | 6 guided projects, from a CLI task tracker to a full-stack AI app |
| [`apps/web/`](./apps/web) | Dashboard (progress tracking) + in-browser Monaco playground |
| [`archive/`](./archive) | The old AI-interview practice app this repo used to be |

## Setup (once)

Requires Node ≥ 20 and [pnpm](https://pnpm.io) (`npm i -g pnpm` or `corepack enable`).

```bash
pnpm install
```

## The daily loop

```bash
# 1. Open today's session guide (week 1, day 3 shown)
#    packages/exercises/week-01-fundamentals/day-03-*/README.md

# 2. Do the reading linked at the top of the guide (10-20 min)

# 3. Drill: fix each .problem.ts until tests AND types are green
pnpm exercise 01-03          # watch mode for the whole day
pnpm exercise 01-03 2        # just exercise 02
pnpm exercise 01-03 --solution   # peek at solutions running (after you're done!)

# 4. Build: do today's project milestone (see the guide's footer)

# 5. Track: check the day off in the dashboard
pnpm web                     # http://localhost:3000
```

Every exercise file is its own test suite — runtime assertions *and*
type-level assertions (`expectTypeOf`, `@ts-expect-error`) run together, so
"green" means your code works **and** your types are right.

### Rules of the dojo

1. **Type everything by hand.** No copy/paste from the README, no tab-complete
   from an AI. Muscle memory is the whole point.
2. **Problem first, solution after.** Only open `.solution.ts` when your
   problem file is green (or you've been genuinely stuck for 15+ minutes —
   then read it, understand it, delete your code, and retype it from memory).
3. **CSS is not your job.** Project guides ship finished stylesheets. You
   write types and logic.

## Quick drills anywhere

`pnpm web` → **/playground** gives you a Monaco editor (VS Code's engine) with
full strict-mode TypeScript checking in the browser, a Run button, and a bank
of quick drills — for practice when you don't want to open the exercises.

## Useful commands

```bash
pnpm exercise <week>-<day>   # daily drill loop (watch mode)
pnpm test                    # run all exercises (watch)
pnpm test:solutions          # verify every solution is green
pnpm web                     # dashboard + playground
```

## Where the material comes from

- [Total TypeScript Essentials](https://www.totaltypescript.com/books/total-typescript-essentials)
  (free book) — daily readings map to its chapters ([source mirror](https://github.com/total-typescript/total-typescript-book))
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) — week 6
- [Zod](https://zod.dev) (v4) — week 5 · [Drizzle ORM](https://orm.drizzle.team) — week 7
- [create-t3-app](https://create.t3.gg) conventions — project structure, env validation
- [type-challenges](https://github.com/type-challenges/type-challenges) — week 8
