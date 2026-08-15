# Day 1 — Modules & Declarations

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Modules, Scripts, and Declaration Files](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/13-modules-scripts-declaration-files.md)

## Goals

By the end of today you can, without looking anything up:

- Use `import type` / `export type`, and explain why `verbatimModuleSyntax`
  makes them mandatory rather than stylistic
- Explain the difference between ESM and CommonJS, and between a *module* and
  a *script* in TypeScript's eyes
- Write a `declare const` for a value that exists at runtime but that
  TypeScript can't see (script-tag globals, bundler-injected constants)
- Say what a `.d.ts` declaration file is and when you'd reach for one

## The concepts (read before the exercises)

- **ESM vs CommonJS.** ESM is `import`/`export` — static, analyzable, what
  the browser and modern Node speak. CommonJS is `require`/`module.exports` —
  dynamic, Node's legacy format. This repo is pure ESM (`"type": "module"` in
  every `package.json`); TypeScript is configured with `module: "ESNext"` so
  what you write is what runs.
- **Module vs script.** Any file with at least one `import` or `export` is a
  *module* with its own scope. A file with neither is a *script* whose
  declarations are global — which is why a stray `utils.ts` with no imports
  can mysteriously pollute your whole project.
- **Types are erased; values are not.** `import type` exists because the
  compiler must know which imports to delete from the emitted JavaScript.
  With `verbatimModuleSyntax: true` (this repo, and Matt Pocock's
  recommendation) it won't guess: type imports *must* say `type`.
- **`declare` is a promise, not code.** `declare const x: T` emits nothing.
  It tells the compiler "this exists at runtime — trust me." Declaration
  files (`.d.ts`) are entire files of such promises; DefinitelyTyped
  (`@types/*`) is a giant pile of them.

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
import type { Config } from "./config.js";
export type { Config };
declare const BUILD_ID: string;
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all
tests and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 04-01        # all of today's exercises
pnpm exercise 04-01 2      # just exercise 02
```

1. `01-import-and-export-type` — fix imports/exports the compiler refuses
2. `02-declare-a-script-global` — declare a script-tag global you don't control
3. `03-bundler-constants` — declare bundler-injected compile-time constants

## The TS-dev mindset for today

- **`import type` is documentation the compiler enforces.** It says "this
  dependency vanishes at build time" — nothing to load, no circular-import
  risk, no side effects.
- **`declare` shifts responsibility to you.** The compiler now believes
  whatever you wrote. Declare the *narrowest* shape you actually use, next to
  where you use it, and let validation (week 5's Zod) guard the truly unknown.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
