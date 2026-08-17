# Project 02 — `ts-utils`: Your Own Typed Utility Library

**Pairs with:** Weeks 3–4 (generics, then modules/packaging)

Every TypeScript dev ends up with a personal `/utils` folder. This project
builds yours — properly: generic signatures that *infer*, a `Result` module,
guards and assertion functions, a typed event emitter, and finally real
packaging with an `exports` map. Project 03 will lean on the ideas (and the
`Result` shape) you build here.

```bash
pnpm --filter project-ts-utils test        # vitest run
pnpm --filter project-ts-utils typecheck   # tsc --noEmit
```

**A rule specific to this project:** the starter stubs ship with finished
signatures so the tests typecheck — but *the signature is the exercise*. For
milestones 1–3, delete the given signature, write your own from the
requirements, and only compare afterwards. Typing `<T, K extends keyof T>`
from memory is the muscle this project trains.

The type-level tests (`expectTypeOf`, `@ts-expect-error`) are checked by
`typecheck` even inside skipped blocks — so your signatures are under test
from day one.

---

## Milestone 1 — `groupBy` + `pick`/`omit`: generics that infer

*(week 3, days 1–2)*

### Goal

`src/group-by.ts` and `src/object.ts` implemented, with inference good enough
that callers never write explicit type arguments.

### Types-first approach

A generic signature is a *contract about inference*. Work each one out from
its call site backwards:

- `groupBy(people, (p) => p.role)` — what flows in? `T` from the array,
  `K` from the callback's return. For `K` to be usable as an object key it
  must be constrained: `K extends PropertyKey` (`string | number | symbol`).
  Return `Record<K, T[]>`. When the callback returns a literal union
  (`"eng" | "pm"`), the result is keyed by that union — the tests assert
  exactly this with `expectTypeOf`.
- `pick(user, ["id", "name"])` — `T` from the object, and `K extends keyof T`
  from the *array literal*. That constraint is the whole feature: `pick(user,
  ["typo"])` must not compile. Return `Pick<T, K>` — you're writing the
  runtime twin of a type you already know.
- `omit` returns `Omit<T, K>`. Same shape, inverted logic.

### Hints

1. `groupBy` body: `reduce` into an accumulator. The honest accumulator type
   is a headache (`Record<K, T[]>` claims every `K` exists!) — it's fine to
   build with a `Partial<Record<K, T[]>>` internally and return it with a
   final annotation. Notice the tests access groups with `?.` — under
   `noUncheckedIndexedAccess` consumers must handle absent keys anyway.
2. `pick`: start from `{}` typed as `Pick<T, K>`? No — building an object
   key-by-key fights the checker. Idiomatic: `Object.fromEntries(keys.map((k)
   => [k, obj[k]]))` then annotate the return. It's OK for the *inside* of a
   well-typed function to do one coarse step — the signature is the promise,
   and the tests verify both levels.
3. `omit`: copy with spread, then `delete` from the copy — or filter entries.
4. If your `K` inference gives `string` instead of `"id" | "name"`, your
   `keys` parameter probably isn't `readonly K[]` — array literals need the
   readonly form to keep their literal element types here.

### Definition of done

- [ ] `.skip` removed from "milestone 1"; tests green; typecheck clean.
- [ ] You wrote each signature yourself before comparing with the starter.
- [ ] In a scratch file, `pick({ a: 1 }, ["b"])` is a compile error.

---

## Milestone 2 — `Result<T, E>`: errors as values

*(week 3, day 2 + week 4 day 4)*

### Goal

`src/result.ts`: `ok`, `err`, `map`, `unwrapOr`, `tryCatch` implemented.

### Types-first approach

`Result` is *the* discriminated union: `{ ok: true; value: T } | { ok: false;
error: E }`. The design questions worth chewing on before implementing:

- Why does `ok` return `Ok<T>` and not `Result<T, never>`? (Try both — watch
  what inference does at call sites. `Ok<T>` keeps things simple; the union
  appears where a variable can genuinely be either.)
- `map` has *three* type parameters — `T, U, E`. The error type rides along
  unchanged; only success transforms. This asymmetry is the whole point of
  Result pipelines.
- `tryCatch` is the bridge between exception-world and value-world. Its catch
  clause receives `unknown` (not `Error`!) — narrowing that is a mini boundary
  exercise: `e instanceof Error ? e : new Error(String(e))`.

### Hints

1. `ok`/`err` are one-liners. Resist adding classes — plain objects narrow
   beautifully and serialize for free.
2. `map`: check `result.ok` and watch the compiler narrow to `Ok<T>` /
   `Err<E>` in each branch. If you need a cast, your union is wrong.
3. When you're done, add `export * from "./result"` (and the milestone-1
   modules) to `src/index.ts` — grow the public surface as you go.

### Definition of done

- [ ] `.skip` removed from "milestone 2"; tests green; typecheck clean.
- [ ] Zero `as` casts, zero `any` in `result.ts`.
- [ ] Bonus reflection: write down (in a comment) when you'd use `Result` vs
      `throw`. (Curriculum answer: expected failures are values; bugs throw.)

---

## Milestone 3 — Type predicates & assertion functions

*(week 3, day 3)*

### Goal

`src/guards.ts`: `isDefined`, `assertNever`, `invariant` implemented.

### Types-first approach

Three ways to teach the compiler something it can't infer:

- **Predicate** — `(value: T | null | undefined) => value is T`. Returns a
  boolean the compiler *trusts*: `array.filter(isDefined)` drops the
  nullish types from the element type. That filter behavior is the test.
- **`never` sink** — `assertNever(value: never): never`. You can only call it
  where the compiler already proved no variant remains — so it's a
  compile-time exhaustiveness check that happens to throw at runtime. You
  hand-rolled this in project 01 milestone 5; now it's a library export.
- **Assertion function** — `asserts condition`. After the call returns, the
  compiler assumes the condition held. Note the starter's comment: assertion
  signatures need `function` declarations (or an explicitly annotated
  `const`) — inference can't produce them. That's a language rule worth
  knowing, not a style choice.

### Hints

1. `isDefined`: `value !== null && value !== undefined` — `!= null` covers
   both but write it explicitly once to internalize why.
2. `invariant`: `if (!condition) throw new Error(message)` — the signature
   does all the interesting work.
3. Try commenting out `invariant`'s call in the "narrows types" test and watch
   the `expectTypeOf` line fail typecheck — that's the assertion signature
   working.

### Definition of done

- [ ] `.skip` removed from "milestone 3"; tests green; typecheck clean.
- [ ] Re-exported from `src/index.ts`.
- [ ] You can explain the difference between `value is T` and
      `asserts value is T` in one sentence each.

---

## Milestone 4 — Typed event emitter (event-map generics)

*(week 3 days 4–5, revisit week 8 day 2)*

### Goal

`src/emitter.ts`: `createEmitter<TEvents>()` implemented, satisfying the given
`Emitter<TEvents>` contract — per-event payload types, multiple handlers,
unsubscribe.

### Types-first approach

The event-map pattern inverts the usual generic flow: the *caller* supplies a
map type up front —

```ts
type AppEvents = { login: { userId: number }; logout: undefined };
const emitter = createEmitter<AppEvents>();
```

— and every method threads `K extends keyof TEvents` so that naming an event
*selects* its payload type via indexed access `TEvents[K]`. Study the given
`Emitter` type until each piece is obvious:

- Why is `K` a parameter *of the method*, not of the type? (Each `.on` call
  can pick a different event.)
- Why `TEvents[K]` and not a second type parameter for the payload? (The map
  already knows; a free parameter would let call sites lie.)

Inside the implementation you'll hit the classic tension: the runtime storage
(a map from event name to handler array) can't express the per-key payload
link, so internally handlers are `(payload: never) => void`-ish. Keeping the
internal storage honest-but-loose while the *public* signature stays precise
is exactly what real libraries do. Do NOT reach for `any` — you can make
`Map<keyof TEvents, Set<(payload: TEvents[keyof TEvents]) => void>>` work.

### Hints

1. Storage: `Map<keyof TEvents, Set<Function>>` is the lazy way — banned
   (`Function` is `any`'s cousin). Use the union-payload handler type above;
   you may need one narrow, commented `as` where you retrieve a handler set
   for a specific `K`. One documented `as` at a proven-safe spot beats ten
   silent ones — this is the "as almost never" rule, not "as never".
2. `on` returns `() => void` that removes the handler from the set — closures
   make unsubscribe trivial.
3. `emit` snapshot: iterate over a *copy* (`[...handlers]`) so a handler that
   unsubscribes during emit doesn't skip its neighbors.
4. The `@ts-expect-error` lines in the test file are assertions too — if your
   signature is too loose, they fail typecheck by *not* erroring.

### Definition of done

- [ ] `.skip` removed from "milestone 4"; tests green; typecheck clean.
- [ ] At most one `as` in the file, with a comment explaining why it's safe.

---

## Milestone 5 — Package it like a real library

*(week 4, days 1–2 + 5)*

### Goal

`project-ts-utils` looks publishable: a curated `src/index.ts` public entry,
an `exports` map in `package.json`, and a `README.md` documenting your API.
No runtime tests — this milestone is verified by commands and by reading.

### Types-first approach

Packaging *is* a typing exercise — the question is "what types do consumers
see, and from where?":

1. **Entry point.** `src/index.ts` should re-export everything public — and
   *only* that. Internal helpers stay unexported. Use `export type { ... }`
   for type-only exports; with `verbatimModuleSyntax` (see the repo's
   `tsconfig.base.json`) the type/value distinction is explicit at every
   import/export site, which is exactly what a library must get right.
2. **Exports map.** Add to `package.json`:
   ```json
   "exports": { ".": "./src/index.ts" }
   ```
   In this monorepo, workspace consumers run TS directly, so pointing at the
   source is legitimate. Then discuss (in your README) what a *published*
   library would do instead — see below.
3. **The build question.** Real packages ship `dist/` with `.js` + `.d.ts`.
   Two mainstream answers: `tsc` with `"noEmit": false` + `declaration: true`
   (simple, no bundling), or `tsup` (esbuild-based; one command emits ESM +
   CJS + `.d.ts`, and its `exports`-map story is why most 2024+ libraries use
   it). You don't need to add the tooling here — write up the tradeoff in the
   README instead; week 4 day 2's tsconfig deep-dive is the background.

### Hints

1. Prove the entry point works from a sibling package: temporarily add
   `"project-ts-utils": "workspace:*"` to project 01's devDependencies,
   `pnpm install`, and import `groupBy` in a scratch file. Remove after.
2. README structure worth copying: one-line pitch, install, a 5-line example
   per module, API table. Write the examples by *running* them with `tsx`.
3. Stretch: `pnpm add -D tsup` in this package, `"build": "tsup src/index.ts
   --format esm --dts"`, and inspect what lands in `dist/` — especially the
   generated `.d.ts`.

### Definition of done

- [ ] `src/index.ts` exports milestones 1–4; `typecheck` and `test` still
      green (milestone blocks 1–4 all un-skipped by now).
- [ ] `exports` map added; import from a sibling package proven to work.
- [ ] `README.md` written, including the `tsc`-vs-`tsup` build note.
