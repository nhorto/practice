# Day 2 — tsconfig Deep Dive: A Tour of This Repo

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Configuring TypeScript](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/14-configuring-typescript.md)

## Goals

By the end of today you can, without looking anything up:

- Explain every line of this repo's `tsconfig.base.json`
- Say what `strict` actually turns on, and name the two extra flags this repo
  adds on top
- Describe how a pnpm workspace wires packages together
- Set up a sane `tsconfig` for a new project from memory

## The tour — open each file as you read

Today's "reading" is mostly *this repository*. Open each file in your editor
and match it against the notes below.

### 1. `pnpm-workspace.yaml` (repo root)

```yaml
packages:
  - apps/*
  - packages/*
  - projects/*
```

Three globs, one monorepo. Every folder matching them that contains a
`package.json` is a *workspace package*: `apps/` for runnable apps (the
dashboard you check days off in), `packages/` for shared code (these
exercises), `projects/` for the things you build each week. One
`pnpm install` at the root links them all.

### 2. Root `package.json`

- `"private": true` — the root is never published; it only orchestrates.
- `"packageManager": "pnpm@..."` — pins the package manager version so
  everyone (and CI) resolves dependencies identically.
- Scripts like `"test": "pnpm --filter exercises test"` — the root doesn't
  *do* anything itself; `--filter <name>` forwards the command to the
  workspace package with that `name`. `pnpm -r typecheck` runs `typecheck`
  in *every* package that defines it.

### 3. `tsconfig.base.json` — the shared compiler contract

Every package `extends` this file. Line by line:

| Flag | Why it's here |
|---|---|
| `"target": "ES2022"` | Emit/assume modern JS (top-level await, class fields). |
| `"lib": ["ES2023"]` | Which built-in APIs exist (`Array.prototype.at`, etc.). No `DOM` here — packages that run in a browser add it themselves. |
| `"module": "ESNext"` | Write and keep real ESM `import`/`export`. |
| `"moduleResolution": "Bundler"` | Resolve imports the way modern bundlers do — no `.js` extensions required, `exports` maps respected. The modern default for app code. |
| `"esModuleInterop": true` | Smooths over importing CommonJS packages from ESM. |
| `"resolveJsonModule": true` | `import data from "./x.json"` works, typed. |
| `"isolatedModules": true` | Forbids code that can't be compiled one file at a time (what esbuild/SWC do). |
| `"verbatimModuleSyntax": true` | Your imports are emitted exactly as written — which forces `import type` for types (yesterday's lesson). |
| `"skipLibCheck": true` | Don't typecheck every `.d.ts` in `node_modules`; huge speed win. |
| `"strict": true` | The umbrella: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `useUnknownInCatchVariables`, and more. Never start a project without it. |
| `"noUncheckedIndexedAccess": true` | NOT part of `strict`: `array[i]` is `T \| undefined`. Today's exercise 03. |
| `"noImplicitOverride": true` | Class methods that override a base method must say `override`. |
| `"noEmit": true` | `tsc` is a *linter* here; running/bundling is someone else's job (`tsx`, Vite). Packages that emit would override this. |

### 4. `packages/exercises/` — a leaf package

- `package.json` — `"type": "module"` (Node treats `.js`/`.ts` as ESM);
  scripts you've been using all along (`exercise`, `test`,
  `test:solutions`, `typecheck`); every dependency is a `devDependency`
  because nothing here ships.
- `tsconfig.json` — `"extends": "../../tsconfig.base.json"`, then *adds*
  what only this package needs: `DOM` libs and `jsx` (for week 6's React
  exercises), `"types": ["node"]`, and an `include` listing which files
  belong to the program.
- `tsconfig.solutions.json` — a second config whose `include` covers only
  `*.solution.ts` files. Why? Problem files are *intentionally broken*, so
  `pnpm typecheck` would always fail on them. Multiple tsconfigs carving up
  one folder is a completely normal trick.
- `vitest.config.ts` — turns on `typecheck` so `expectTypeOf` and
  `@ts-expect-error` assertions run alongside runtime tests, and points it
  at `tsconfig.json`.

## Warm-up (5 min)

Without looking at the table above, write out a minimal strict `tsconfig`
for a new ESM project from memory:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
```

Then check yourself against `tsconfig.base.json`.

## Exercises

Each exercise shows what one strictness flag actually catches — the code is
exactly what people write when the flag is off.

```bash
pnpm exercise 04-02        # all of today's exercises
pnpm exercise 04-02 2      # just exercise 02
```

1. `01-no-implicit-any` — parameters, callbacks, and destructuring holes
2. `02-strict-null-checks` — nullable fields, `Map.get`, `Array.find`
3. `03-no-unchecked-indexed-access` — `array[i]` and `record[key]` honesty

## The TS-dev mindset for today

- **Strictness is cheapest on day one.** Every flag here multiplies errors
  when retrofitted. New project: `strict` + `noUncheckedIndexedAccess`,
  before the first line of code.
- **tsconfig is inherited, not copy-pasted.** One base file, packages extend
  and add only what makes them different. If you're editing the same flag in
  five configs, you've lost.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
