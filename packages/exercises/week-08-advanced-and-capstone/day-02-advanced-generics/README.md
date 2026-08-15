# Day 2 — Advanced Generics Workout

**Time:** ~90–120 min · **Reading:** [Total TypeScript — The `/utils` Folder](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/16-the-utils-folder.md)

Three patterns that show up in every serious TypeScript codebase: the typed
event emitter (generics as a lookup table), the fluent builder (generics as an
accumulator), and typed collection utilities (generics as inference targets).
This is the day the machinery from weeks 3–7 has to work together.

## Goals

By the end of today you can, without looking anything up:

- Write a method generic over `K extends keyof Events` so payload types are
  looked up per event name
- Thread an accumulating type parameter through a fluent chain so the built
  type grows with every call
- Write utilities like `pick` and `groupBy` whose return types are computed
  (`Pick<T, K>`, `Record<K, T[]>`) from what the caller passes in
- Explain when an internal `as` cast is honest (the public API stays sound,
  the compiler just can't track a per-key correlation)

## Warm-up (5 min)

Type from memory:

```ts
const first = <T,>(items: T[]): T | undefined => items[0];
type EventMap = Record<string, unknown>;
const get = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];
```

## Exercises

```bash
pnpm exercise 08-02        # all of today's exercises
pnpm exercise 08-02 2      # just exercise 02
```

1. `01-typed-event-emitter` — `on`/`emit` generic over an event map
2. `02-fluent-builder` — a chain whose return type accumulates every `.set()`
3. `03-pick-and-group-by` — utilities with computed return types

## The TS-dev mindset for today

- **Generics are for relating things.** An event name relates to its payload;
  a chain of `.set()` calls relates to the final config; the keys you pick
  relate to the object you get back. If two positions must agree, that's a
  type parameter.
- **Keep the cast inside, keep the API sound.** Sometimes storage (a `Map`, an
  accumulator object) can't express the per-key relationship the API promises.
  One well-commented cast at the storage boundary beats `any` everywhere.

## Today's build (~30 min)

**Project 02 — ts-utils library** · [`projects/02-ts-utils-library`](../../../../projects/02-ts-utils-library/GUIDE.md)

Optional: revisit **milestone 4** of the ts-utils library with today's advanced emitter generics.

```bash
pnpm --filter project-ts-utils test
```

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
