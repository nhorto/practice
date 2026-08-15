# Day 5 — Custom Hooks & Context

**Time:** ~60–90 min · **Reading:** [React TypeScript Cheatsheet — Custom Hooks](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks) · [react.dev — Using TypeScript: useContext](https://react.dev/learn/typescript#typing-usecontext)

## Goals

By the end of today you can, without looking anything up:

- Return a proper tuple from a custom hook with `as const` — and say what
  gets inferred without it
- Set up Context for "a provider is required" data: `createContext<T | null>(null)`
  plus a custom consumer hook that throws, so consumers get a guaranteed `T`
- Put a Zod schema at the localStorage boundary and make the parsing helper
  generic, so the hook's state type follows from the schema

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```tsx
import { createContext, useState } from "react";

const useFlag = (initial: boolean) => {
  const [flag, setFlag] = useState(initial);
  return [flag, () => setFlag((f) => !f)] as const;
};

type Session = { userId: string };
const SessionContext = createContext<Session | null>(null);
```

## Exercises

Run each with the exercise runner and edit the `.problem.tsx` file until all
tests and type checks are green. Only then compare with the `.solution.tsx`.

```bash
pnpm exercise 06-05        # all of today's exercises
pnpm exercise 06-05 3      # just exercise 03
```

1. `01-tuple-returns` — `as const` turns `(A | B)[]` into `readonly [A, B]`
2. `02-null-safe-context` — Context + a throwing consumer hook
3. `03-zod-localstorage-hook` — a generic, Zod-validated storage parser

## The TS-dev mindset for today

- **A custom hook's signature is its API.** Nail the return type (tuple or
  named object) and every consumer destructures cleanly; get it wrong and
  the mess spreads to every call site.
- **Handle `null` once, at the boundary.** The throwing consumer hook is the
  same move as Zod at the storage boundary: validate in one place, and the
  rest of the tree works with honest, narrow types.
- The runtime parts worth testing (reducers yesterday, `parseStored` today)
  are pure functions — keep them extractable and test them without React.

## Done?

Week 6 wrapped — check the day off in the [dashboard](http://localhost:3000)
and skim week 7's README.
