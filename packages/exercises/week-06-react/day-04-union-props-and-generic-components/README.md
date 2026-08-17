# Day 4 — Union Props & Generic Components

**Time:** ~60–90 min · **Reading:** [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) · [react.dev — Using TypeScript](https://react.dev/learn/typescript)

## Goals

By the end of today you can, without looking anything up:

- Model props that depend on each other as a discriminated union, so invalid
  prop combinations are compile errors (proven with `@ts-expect-error`)
- Explain why one interface full of optional props makes "impossible states
  representable" — and forces defensive checks in the body
- Write a generic component (`<Item,>` syntax in `.tsx`) whose callback props
  receive the inferred item type
- Use `NoInfer` to pick which prop drives the inference

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```tsx
type ToastProps =
  | { kind: "info"; text: string }
  | { kind: "action"; text: string; onAction: () => void };

const first = <Item,>(items: readonly Item[]): Item | undefined => items[0];
```

## Exercises

Run each with the exercise runner and edit the `.problem.tsx` file until all
tests and type checks are green. Only then compare with the `.solution.tsx`.

```bash
pnpm exercise 06-04        # all of today's exercises
pnpm exercise 06-04 2      # just exercise 02
```

1. `01-discriminated-union-props` — make illegal prop combos unrepresentable
2. `02-generic-list` — a `List` whose `renderItem` knows the item type
3. `03-generic-select` — options, value, and onChange locked to the same literals

## The TS-dev mindset for today

- **Design the props type so wrong usage doesn't compile.** Every
  `@ts-expect-error` in today's tests is a requirement: if the directive is
  "unused", your type still allows something it shouldn't.
- **Generics express relationships, not cleverness.** `List<Item>` exists so
  `items` and `renderItem` agree — that's the whole job.
- In `.tsx` files a generic arrow function needs `<Item,>` — the trailing
  comma stops the parser reading a JSX tag.

## Today's build (~30 min)

**Project 04 — React todo app** · [`projects/04-react-todo`](../../../../projects/04-react-todo/GUIDE.md)

**Milestone 3** — apply today's discriminated-union props and generic components to the todo list.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
