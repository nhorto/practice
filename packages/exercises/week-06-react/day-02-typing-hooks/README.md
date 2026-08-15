# Day 2 — Typing Hooks

**Time:** ~60–90 min · **Reading:** [React TypeScript Cheatsheet — Hooks](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/) · [react.dev — Using TypeScript: Hooks](https://react.dev/learn/typescript#example-hooks)

## Goals

By the end of today you can, without looking anything up:

- Say when `useState` inference is enough and when you must write
  `useState<Todo[]>([])` or `useState<string | null>(null)` yourself
- Create refs the React 19 way — `useRef` always takes an initial value — for
  DOM nodes, mutable counters, and "not set yet" values
- Model reducer actions as a discriminated union and write the reducer as an
  exhaustively-checked pure function you can unit-test without React

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```tsx
import { useRef, useState } from "react";

const [items, setItems] = useState<string[]>([]);
const [selected, setSelected] = useState<string | null>(null);
const inputRef = useRef<HTMLInputElement>(null);

type Action = { type: "add"; item: string } | { type: "clear" };
```

(Imagine the hooks inside a component — the point is the type arguments.)

## Exercises

Run each with the exercise runner and edit the `.problem.tsx` file until all
tests and type checks are green. Only then compare with the `.solution.tsx`.

```bash
pnpm exercise 06-02        # all of today's exercises
pnpm exercise 06-02 3      # just exercise 03
```

1. `01-usestate-inference` — inference vs explicit type arguments
2. `02-useref-initial-value` — React 19 refs: the argument is required
3. `03-usereducer-discriminated-actions` — a pure, exhaustive, testable reducer

## The TS-dev mindset for today

- **Type the state, not the render.** Almost every hook typing decision is
  "what is the full lifetime of this value?" — `[]` today but `Todo[]`
  tomorrow, `null` now but `string` after the first error.
- **The reducer is just a function.** Keep it pure and export it; the tests
  here call it directly with states and actions — no renderer, no React.
- Hooks in this package appear only inside component bodies that are never
  invoked — the type checker still checks every line of them.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
