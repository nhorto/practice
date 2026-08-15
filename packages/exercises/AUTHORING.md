# Exercise authoring conventions

How exercises in this package are written. Follow these exactly — the runner,
test setup, and dashboard all depend on them.
`week-01-fundamentals/day-01-annotations-and-functions/` is the exemplar.

## Layout

```
week-0X-<slug>/
  day-0Y-<slug>/
    README.md                    # the session guide
    01-<slug>.problem.ts(x)      # what the learner edits
    01-<slug>.solution.ts(x)     # the reference answer
    02-...
```

- 3–4 exercises per day. Numbered `01-`, `02-`, ... with kebab-case slugs.
- `.tsx` only when JSX is involved (week 6). Everything else `.ts`.
- Never import from another exercise file or another day.

## Exercise files

- Every file starts with a `/** ... */` header: exercise title, a short
  explanation of the concept, and a `🎯` line saying exactly what to do.
- Tests live at the bottom of the same file under a
  `// --- tests ---` divider: `import { expect, expectTypeOf, it } from "vitest"`.
- Every file must contain at least one `it()` block.
- Type-level assertions (`expectTypeOf`, `@ts-expect-error`) go inside `it()`
  blocks alongside runtime assertions.
- **Problem files must fail** (type errors and/or failing runtime tests) and
  **solution files must pass** `vitest run --typecheck` — both runtime and
  types. The learner's loop is red → green.
- Problem and solution share identical tests; only the exercise code differs.
- Two exercise shapes are allowed:
  - *type-fix*: code runs but types are wrong/missing (runtime tests may
    already pass; the type tests fail),
  - *implement*: learner writes the body too (`TODO` comments mark the spot).

## Compiler settings that WILL bite you

The package tsconfig is maximally strict (`strict`,
`noUncheckedIndexedAccess`, `verbatimModuleSyntax`):

- `array[0]` is `T | undefined` — in test code use `array[0]!` or optional
  chaining; in teaching code, handle it honestly.
- Type-only imports must use `import type`.
- No implicit `any` anywhere — in *problem* files unannotated params are often
  the intended exercise error.

## Style rules (drill these, never contradict them)

- `type` by default; `interface` only when `extends`-ing.
- No enums — `as const` objects + `(typeof X)[keyof typeof X]`.
- No `any` in solutions, ever. `unknown` + narrowing.
- Derive types (`typeof`, `keyof`, indexed access, `z.infer`) over duplicating.
- Discriminated unions for state; exhaustive `switch` with `never` default.
- Arrow-function consts for helpers is fine; match the exemplar's voice.

## Library versions in scope

- **Zod v4** (`zod@^4`): top-level `z.email()`/`z.uuid()`/`z.url()` (NOT
  `.email()` methods); unified `{ error: "..." }` param (NOT `message`/
  `invalid_type_error`); `z.strictObject()`/`z.looseObject()` (NOT
  `.strict()`/`.passthrough()`); `.extend()` (NOT `.merge()`);
  `z.record(keySchema, valueSchema)` requires two args; error helpers are
  `z.flattenError()`/`z.treeifyError()`.
- **React 19 types** (`@types/react@^19`): no `React.FC`; no `forwardRef`
  (ref is a normal prop); `useRef` requires an argument; children is
  `React.ReactNode`; wrap DOM elements with `ComponentPropsWithoutRef<'button'>`.
  React exercises are type-focused `.tsx` — no DOM environment; test by
  calling components as functions or asserting prop types, never rendering.
- **Drizzle** (`drizzle-orm@^0.44`): sqlite-core tables; type exercises use
  `$inferSelect`/`$inferInsert` and query builder types — typecheck-focused,
  no live database in this package.

## Day README template

Match `day-01`'s README: title, `**Time:**` + `**Reading:**` line, Goals
(checkable "can do without looking it up" bullets), a 5-minute Warm-up typed
from memory, the exercise list with runner commands, a "TS-dev mindset"
callout, and a Done? footer. Reading links use the verified chapter mirrors:
`https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/<file>.md`
(files `01-setup-typescript.md` … `16-the-utils-folder.md`), plus official
docs (zod.dev, orm.drizzle.team, react-typescript-cheatsheet.netlify.app).

## Verifying your work

From `packages/exercises`. Note that vitest's positional filters are
**substring matches, not regex** — use shell globs to select files:

```bash
# problems for one day: must FAIL (for the intended, lesson-shaped reason)
pnpm exec vitest run --typecheck week-03-generics/day-01-*/*.problem.ts

# solutions for one day: must PASS
pnpm exec vitest run --typecheck week-03-generics/day-01-*/*.solution.ts

# every solution in the package: must PASS
pnpm test:solutions
```

A day is done only when every solution passes and every problem fails for the
*intended* reason (check the error output reads like the lesson, not like a
broken test).
