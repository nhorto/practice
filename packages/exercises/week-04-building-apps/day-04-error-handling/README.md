# Day 4 — Error Handling with `Result`

**Time:** ~60–90 min · **Reading:** none today — this README teaches the pattern.

## Goals

By the end of today you can, without looking anything up:

- Write `Result<T, E>` as a discriminated union and explain why the naive
  "boolean + optionals" version doesn't narrow
- Model error variants as a discriminated union and handle them exhaustively
  with an `assertNever` default
- Wrap a throwing, `any`-returning API (`JSON.parse`) into a safe,
  Result-returning one
- Implement and use `unwrapOr` and `mapResult`

## The pattern (read before the exercises)

TypeScript's types are silent about exceptions. This signature:

```ts
const parseConfig = (text: string): Config => { ... }
```

might throw on every call — the type system will never tell you, and callers
will never be forced to care. The TS-dev answer is to make failure a
*return value*:

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const parseConfig = (text: string): Result<Config, ParseError> => { ... }
```

Now failure is in the signature. A caller *cannot* reach `result.value`
without first checking `result.ok` — the discriminated union you drilled in
week 1 does the enforcement, for free, at compile time.

Three rules make the pattern work in real apps:

1. **The discriminant does the narrowing.** `ok: true | false` splits the
   union; `ok: boolean` with optional fields does not. (Exercise 01.)
2. **Errors are data.** Give each failure mode its own variant with its own
   payload, and switch exhaustively with a `never` default so new variants
   can't be silently unhandled. (Exercise 02.)
3. **Throwing APIs get wrapped once, at the edge.** One `try/catch` in a
   wrapper; everything past it is honestly typed. (Exercises 03–04.)

When to still throw: truly unrecoverable programmer errors (assertion
failures) — things no caller could meaningfully handle. Everything a caller
*should* handle belongs in a `Result`.

## Warm-up (5 min)

Type the core of the pattern from memory:

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all
tests and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 04-04        # all of today's exercises
pnpm exercise 04-04 2      # just exercise 02
```

1. `01-result-type` — from boolean-flag to discriminated union
2. `02-error-variants` — grow an error union; let `never` find the switches
3. `03-wrap-throwing-apis` — tame `JSON.parse` (the throw AND the `any`)
4. `04-result-helpers` — implement generic `unwrapOr` and `mapResult`

## The TS-dev mindset for today

- **Make illegal states unrepresentable.** A "failed" result that still has a
  `value` shouldn't be expressible. The union shape guarantees it.
- **`never` is your exhaustiveness alarm.** `default: assertNever(x)` costs
  one line and turns every forgotten case into a compile error at the exact
  spot that needs editing.

## Today's build (~30 min)

**Project 02 — ts-utils library** · [`projects/02-ts-utils-library`](../../../../projects/02-ts-utils-library/GUIDE.md)

**Milestone 2** revisited — harden `Result<T, E>` with today's error-handling patterns.

```bash
pnpm --filter project-ts-utils test
```

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
