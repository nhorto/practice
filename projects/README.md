# Guided Projects

Exercises drill syntax; projects build the muscle memory of *structuring* real
TypeScript code — repo layout, module boundaries, boundaries between typed and
untyped data. Each project pairs with a curriculum week (see
[CURRICULUM.md](../CURRICULUM.md)) and is broken into **milestones**.

## Coach mode

The guides do not hand you finished code. Every milestone in a `GUIDE.md` has
four parts:

1. **Goal** — what works when the milestone is done.
2. **Types-first approach** — how a TypeScript dev would *design the types
   before writing logic*. This is the heart of each milestone: model the
   domain, derive everything else.
3. **Hints** — nudges, API names, and traps to avoid. Read them only when
   stuck; each one gives away a bit more.
4. **Definition of done** — a checklist (usually: specific tests un-skipped
   and green, `typecheck` clean, and a behavior you can demo from the CLI/UI).

**You type everything yourself.** No copy/paste — even for snippets shown in a
guide. Typing the code out is the point.

Projects 01–03 ship as **starter workspace packages**: a `package.json`,
`tsconfig.json`, a typed skeleton whose stubs `throw new Error("TODO: milestone N")`,
and a `tests/milestones.test.ts` with tests grouped per milestone. Tests for
milestones you haven't reached are wrapped in `describe.skip` — remove the
`.skip` as you start each milestone, then make them green.

Projects 04–06 are **guide-only**: scaffolding the app (Vite, Next.js) *is*
milestone 1, so there is no starter package — just a `GUIDE.md` and, where the
project has a UI, a finished stylesheet. **You never write CSS in this
curriculum**: every UI project ships a complete `.css` file you copy in as-is.

## The projects

| # | Project | Pairs with | What you build | Starter? |
|---|---------|-----------|----------------|----------|
| 01 | [CLI Task Tracker](./01-cli-task-tracker/) | Weeks 1–2 | A todo CLI run with `tsx`: add/list/complete/filter, JSON-file persistence, hand-rolled narrowing (pre-Zod) | ✅ package |
| 02 | [`ts-utils` Library](./02-ts-utils-library/) | Weeks 3–4 | Your own typed utility library: generics (`groupBy`, `pick`), `Result<T,E>`, type predicates, a typed event emitter, packaging | ✅ package |
| 03 | [Zod API Client](./03-zod-api-client/) | Week 5 | A typed PokeAPI client: schema-first modelling, generic `fetchAndParse`, transforms, branded IDs, caching. Tests run offline against fixtures | ✅ package |
| 04 | [React Todo](./04-react-todo/) | Week 6 | Vite + React todo app: reducer with a discriminated `Action` union, typed props/events, Zod-validated `localStorage` | guide + CSS |
| 05 | [Full-stack Notes](./05-fullstack-notes/) | Week 7 | Next.js App Router + Drizzle (better-sqlite3) + Zod notes app: schema → migrations → typed data layer → validated server actions | guide + CSS |
| 06 | [Capstone: AI Prompt Library](./06-capstone-ai-app/) | Week 8 | Next.js "prompt library + chat playground", typed end to end: streaming events as discriminated unions, a provider-agnostic `ChatProvider`, Zod at every boundary | guide + CSS |

## Working on a starter project (01–03)

```bash
# once, from the repo root, after the packages exist
pnpm install

# then, from the project folder (or with --filter from the root)
pnpm --filter project-cli-task-tracker start       # run the app
pnpm --filter project-cli-task-tracker test        # vitest run
pnpm --filter project-cli-task-tracker typecheck   # tsc --noEmit
```

The starter always typechecks and its test suite passes (unreached milestones
are skipped). Keep it that way: after every work session, `typecheck` and
`test` should both be green — skipped tests are fine, failures are not.

## The style rules every guide enforces

Same list as the curriculum — the projects are where they become habits:

- **`type` over `interface`** (`interface` only when you genuinely `extends`).
- **No enums.** `as const` objects/arrays + derived unions.
- **No `any`, ever.** `unknown` + narrowing; Zod at boundaries (from week 5).
- **Derive, don't duplicate**: `typeof`, `keyof`, indexed access, `z.infer`,
  `$inferSelect`.
- **Discriminated unions for state**; invalid states unrepresentable.
- **Exhaustive `switch` with a `never` check** so adding a variant breaks the
  build in every place that must handle it.
- **Errors as values** at expected-failure boundaries (`Result`-shaped
  returns); `throw` only for bugs.
