# Day 1 — Typing Components

**Time:** ~60–90 min · **Reading:** [React TypeScript Cheatsheet — Function Components](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/) · [react.dev — Using TypeScript](https://react.dev/learn/typescript)

## Goals

By the end of today you can, without looking anything up:

- Type a component as a plain function with an annotated props parameter — and explain why you skip `React.FC`
- Make props optional and give them defaults in the destructuring pattern
- Type `children` as `React.ReactNode` and say what it accepts
- Type a prop that takes a *component* (`ComponentType<P>`) and explain how that differs from a prop that takes an *element*

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```tsx
import type { ReactNode } from "react";

type CardProps = { title: string; children: ReactNode };

const Card = ({ title, children }: CardProps) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);
```

## Exercises

Run each with the exercise runner and edit the `.problem.tsx` file until all
tests and type checks are green. Only then compare with the `.solution.tsx`.

```bash
pnpm exercise 06-01        # all of today's exercises
pnpm exercise 06-01 2      # just exercise 02
```

1. `01-props-not-fc` — annotate props on a plain function; retire `React.FC`
2. `02-optional-props-with-defaults` — optional props, defaults at the destructure
3. `03-children` — `children: ReactNode` accepts anything renderable
4. `04-component-as-prop` — a component that receives another component

## The TS-dev mindset for today

- **A component is just a function.** Annotate its props parameter like any
  other parameter and let the return type be inferred. `React.FC` widens the
  return type, adds nothing, and fights generic components later this week.
- **Element ≠ component.** `<Star />` is an element (a value); `Star` is a
  component (a function). Props that let the parent choose the props take the
  component.
- There's no DOM in this package — tests call components as plain functions
  and assert on `element.props`. Nothing renders, and nothing needs to.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
