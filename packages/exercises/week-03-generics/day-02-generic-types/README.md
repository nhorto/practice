# Day 2 — Generic Types

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Designing Your Types](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/15-designing-your-types.md)

## Goals

By the end of today you can, without looking anything up:

- Write a generic type alias (`Maybe<T>`, `Result<T, E>`) and use it in signatures
- Explain why a discriminated union beats a "bag of optional properties"
- Build a data structure that is generic over a whole object shape
- Compose generic types (`ApiResponse<Paginated<User>>`) instead of writing
  one-off types for every payload

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
type Maybe<T> = { kind: "some"; value: T } | { kind: "none" };
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
type Wrapper<TData> = { data: TData; fetchedAt: Date };
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 03-02        # all of today's exercises
pnpm exercise 03-02 2      # just exercise 02
```

1. `01-maybe` — a generic union for "might not be there"
2. `02-result` — replace a bag of optionals with `Result<T, E>`
3. `03-typed-store` — a key-value store generic over an object shape
4. `04-api-response` — compose generic wrappers for API payloads

## The TS-dev mindset for today

- **Types are the design.** `Result<T, E>` documents "this can fail, and
  here's how" better than any comment — and the compiler enforces that callers
  handle both arms.
- **Optional properties are where guarantees go to die.** If `value` only
  exists when `ok` is true, SAY that with a discriminated union; don't make
  every reader null-check both fields.
- **Generic types are Lego bricks.** `ApiResponse<Paginated<User>>` composes
  three small types; the alternative is a hand-written type per endpoint that
  drifts out of sync.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
