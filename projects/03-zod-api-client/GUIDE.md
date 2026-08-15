# Project 03 — Typed API Client (Zod + PokeAPI)

**Pairs with:** Week 5 (Zod: types at runtime)

A typed client for [PokeAPI](https://pokeapi.co) — stable, free, no auth. The
week's mantra is **parse, don't validate**: every byte that crosses into the
app goes through a Zod schema, and every type on the inside is *derived* from
those schemas.

Two worlds, strictly separated:

- **Tests are 100% offline.** `fixtures/*.json` are hand-copied subsets of
  real PokeAPI responses; milestone-2 tests inject a fake `fetch`. `pnpm test`
  must pass on a plane.
- **The CLI is online.** `pnpm --filter project-zod-api-client start pikachu`
  does real fetches once milestone 5 wires it up.

```bash
pnpm --filter project-zod-api-client test        # offline, always
pnpm --filter project-zod-api-client typecheck
pnpm --filter project-zod-api-client start pikachu bulbasaur   # real network (milestone 5)
```

### ⚠️ Zod v4, not v3

This repo uses **zod 4**. Most blog posts and older LLM answers show v3 API.
The differences you'll hit this week:

| v3 (do NOT write) | v4 (write this) |
|---|---|
| `z.string().url()`, `z.string().email()` | `z.url()`, `z.email()` (top-level formats) |
| `{ message: "..." }` | `{ error: "..." }` |
| `schemaA.merge(schemaB)` | `schemaA.extend(schemaB.shape)` / `.extend({...})` |
| `z.object(...).strict()` | `z.strictObject(...)` |
| `z.record(valueSchema)` (1 arg) | `z.record(keySchema, valueSchema)` (always 2) |

---

## Milestone 1 — Schema-first: model the subset you need

*(week 5, days 1–2)*

### Goal

Grow `PokemonSchema` and `TypeInfoSchema` in `src/schemas.ts` until the
milestone-1 tests pass against the fixtures. The fixtures are the spec —
open them side by side with the schema file.

### Types-first approach

Schema-first flips the project-01 workflow: you don't write a `Pokemon` type
and then a validator — you write the *schema*, and the type falls out of
`z.infer<typeof PokemonSchema>`. One artifact, both worlds. The starter file
already ends with the `z.infer` lines; as your schema grows, hover `Pokemon`
and watch the type grow with it. You never edit the type. That's rule #1
(derive, don't declare) supercharged.

Design decisions to make deliberately:

- **Model only what you use.** PokeAPI's real `pokemon` payload has ~40
  fields; the fixture keeps ~8. `z.object` ignores unknown keys by default —
  which is exactly right for a client (the server may add fields any day).
  Know that `z.strictObject` exists and why you're NOT using it here (you'd
  use it for *your own* config files, where unknown keys mean typos).
- **Reuse `NamedResourceSchema`.** The `{ name, url }` pair appears in
  `types[].type`, `stats[].stat`, `abilities[].ability`, and all over
  `damage_relations` — compose it, don't repeat it.
- Constrain meaningfully: `z.number().int().positive()` for ids,
  `z.url()` for urls. A schema is documentation that runs.

### Hints

1. `types: z.array(z.object({ slot: z.number().int(), type: NamedResourceSchema }))`
   — build the rest by analogy.
2. `sprites.front_default` can be `null` in the real API (some formes have no
   sprite): `z.url().nullable()` is the honest model even though the fixtures
   are non-null.
3. `damage_relations` is six keys, each `z.array(NamedResourceSchema)`.
   Tempted by `z.record(z.string(), z.array(NamedResourceSchema))`? Don't —
   the six keys are known, and a record would erase them. Records are for
   genuinely dynamic keys.
4. Zod error messages: when a test fails, log
   `z.prettifyError(result.error)` — v4's built-in formatter — to see exactly
   which path failed.

### Definition of done

- [ ] `.skip` removed from "milestone 1"; tests green; typecheck clean.
- [ ] Hovering `Pokemon` in your editor shows the full inferred shape; there
      is no hand-written `type Pokemon = {...}` anywhere.
- [ ] You can say when you'd pick `z.strictObject` over `z.object`.

---

## Milestone 2 — `fetchAndParse<T>`: one typed doorway to the network

*(week 5, days 2–4)*

### Goal

`src/client.ts`: implement `fetchAndParse(url, schema, fetchImpl?)`. Every
network interaction in the app goes through this ONE function; it never
throws — all three failure modes come back as `FetchError` values.

### Types-first approach

Read the signature like a sentence: *give me a URL and a `ZodType<T>`, and
I'll give you a `Result<T, FetchError>`*. The generic `T` is inferred **from
the schema argument** — callers write
`fetchAndParse(url, PokemonSchema)` and get `Result<Pokemon, FetchError>`
without naming `T`. Schema as the source of truth again, now at a function
boundary.

`FetchError` (in `src/result.ts`) is a discriminated union — study why each
variant carries different fields (`status` only exists for `http`, a
`message` only where there's an underlying error to relay). Callers can
switch on `error.kind` exhaustively.

The injectable `fetchImpl: typeof fetch = fetch` parameter is the offline
trick: prod code passes nothing; tests pass a canned-Response fake. This is
dependency injection earning its keep with zero framework.

### Hints

1. Skeleton: `try { const response = await fetchImpl(url) } catch (e) { return fail({ kind: "network", ... }) }`.
   Remember `catch` gives you `unknown` — narrow before reading `.message`.
2. Check `response.ok` before touching the body → `{ kind: "http", status: response.status, url }`.
3. `await response.json()` then `schema.safeParse(...)` — `safeParse`, not
   `parse`: this whole function exists so that *nothing throws*. On failure,
   `z.prettifyError(parsed.error)` makes a good `message`.
4. `response.json()` itself can reject on malformed JSON — decide which error
   kind that is (defensible either way; `parse` is the common choice) and
   handle it.

### Definition of done

- [ ] `.skip` removed from "milestone 2"; tests green (still offline!);
      typecheck clean.
- [ ] In a scratch call, hover the result of
      `fetchAndParse(url, TypeInfoSchema)` — it's `Result<TypeInfo, FetchError>`
      with no explicit type arguments.
- [ ] One-off manual check: temporarily call it for real in `main.ts` with
      `${BASE_URL}/pokemon/pikachu` and log the result. Then revert.

---

## Milestone 3 — Transforms: API shape → domain shape

*(week 5, day 3)*

### Goal

`src/transform.ts`: implement `toPokemonSummary`, mapping the raw parsed
`Pokemon` (snake_case, nested refs, API units) into the clean `PokemonSummary`
the rest of the app wants.

### Types-first approach

Two layers, two rules:

- The **API layer** (`Pokemon`) is *derived* from the schema — it mirrors the
  wire format, warts and all (`base_experience`, decimeters).
- The **domain layer** (`PokemonSummary`) is *declared* — it's your design:
  camelCase, meters and kilograms, `types: string[]` instead of slot objects.

Keeping both layers, with one pure function between them, means a PokeAPI
rename touches the schema + transform and nothing else. That's the payoff.

Alternative worth knowing: Zod can do this inline with
`.transform()` — `PokemonSchema.transform(toDomain)` yields a schema whose
*output* type is the domain shape (`z.infer` gives the output; `z.input`
still gives the wire shape). Try it as a stretch; the separate-function
version stays because it's independently testable.

### Hints

1. `types`: sort by `slot`, then map to `t.type.name`.
2. `stats`: `Object.fromEntries(pokemon.stats.map((s) => [s.stat.name, s.base_stat]))`
   — and notice the inferred type. `Record<string, number>` is honest here
   because stat names *are* dynamic strings from the API's perspective.
3. Units: height ÷ 10 = meters; weight ÷ 10 = kg. Yes, both ÷ 10 — PokeAPI
   is decimeters and hectograms. Comment it; future-you will not believe it.

### Definition of done

- [ ] `.skip` removed from "milestone 3"; tests green; typecheck clean.
- [ ] You can articulate which types in this project are derived and which
      are declared, and why each is which.

---

## Milestone 4 — Caching with a typed Map + branded IDs

*(week 5, days 4–5 — brands day)*

### Goal

`src/cache.ts`: implement `toPokemonId`, `toPokemonName`, and
`createCache<K, V>` satisfying the `Cache` contract (`get`/`set`/`getOrLoad`).

### Types-first approach

A brand is a compile-time-only tag: `number & { [brand]: "PokemonId" }` is a
`number` at runtime, but a distinct type to the checker. The `unique symbol`
in the starter means nobody can forge the property — the *only* way to obtain
a `PokemonId` is through `toPokemonId`, which validates first. Brand =
validation certificate. This is why the tests assert that a bare `25` does
NOT typecheck as a `PokemonId`.

Note the throw-vs-Result decision, made explicitly in the starter comment:
`toPokemonId(-1)` **throws**. A negative id can only come from a programmer
mistake, not from user input — bugs throw, expected failures are values.
Contrast with `fetchAndParse`, which is all values. Knowing which side of
that line you're on is a design skill this curriculum keeps drilling.

`createCache<K, V>` is deliberately generic — `Cache<PokemonId, Pokemon>`
composes the brand with the cache so `cache.get(7)` won't compile but
`cache.get(toPokemonId(7))` will.

### Hints

1. `toPokemonId`: validate with `Number.isInteger(id) && id > 0`, then return
   `id as PokemonId` — the one place `as` is legitimate, because the cast IS
   the minting operation and validation precedes it. (Zod alternative:
   `z.number().int().positive().brand<"PokemonId">()` — try it as a stretch;
   `.brand()` is Zod's built-in version of this pattern.)
2. `createCache`: close over `new Map<K, V>()`. `getOrLoad` must handle the
   `undefined`-means-missing convention: `const hit = map.get(key); if (hit !== undefined) return hit;`.
3. Stretch: cache `fetchAndParse` results keyed by `PokemonName` in `main.ts`
   next milestone, so `start pikachu pikachu` fetches once.

### Definition of done

- [ ] `.skip` removed from "milestone 4"; tests green; typecheck clean
      (including the `@ts-expect-error` assertions — they fail if your brand
      is fake).
- [ ] `toPokemonId` is the only `as` in the file, with validation above it.

---

## Milestone 5 — A small CLI that prints a formatted report

*(week 5, day 5)*

### Goal

`formatReport` implemented in `src/report.ts`, and `src/main.ts` wired
end-to-end: for each name on argv → cached `fetchAndParse` → `toPokemonSummary`
→ one combined `formatReport` → print. Real network, typed at every joint.

### Types-first approach

Look at what the pipeline signature-checks into: `string[]` (argv) →
`PokemonName[]` (branded at the boundary) → `Result<Pokemon, FetchError>[]` →
split ok/err — errors printed to `stderr` per name, successes transformed and
reported on `stdout`. Every arrow is a function you already wrote. `main`
should contain almost no logic — if it does, a milestone function is missing
something.

Handle errors with an exhaustive `switch (error.kind)` when formatting the
per-name failure line (`missingno → HTTP 404` reads better than a stack
trace). A `never` default catches future FetchError variants.

### Hints

1. `await Promise.all(names.map(...))` — fetch concurrently; the Result shape
   means one failure doesn't reject the batch. (This is why `fetchAndParse`
   never throws.)
2. Exit code: any failed name → `process.exitCode = 1`, but still print the
   successes.
3. Formatting: pad stat names with `padEnd`, print a `▇`-bar scaled by base
   stat if you're feeling fancy. Tests only check content, not layout.
4. Demo: `pnpm --filter project-zod-api-client start pikachu bulbasaur missingno`
   — two report cards and one friendly error.

### Definition of done

- [ ] All milestone blocks un-skipped; `test` and `typecheck` green —
      **offline** (turn off wifi and run them; this is the point of the
      project).
- [ ] The CLI works online with mixed good/bad names and exits non-zero on
      failures.
- [ ] Count the `any`s in the project: zero. Count the `as`es: one (the brand
      mint). That ratio is what "Zod at the boundary" buys.
