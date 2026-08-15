# Day 3 — Events & DOM Element Props

**Time:** ~60–90 min · **Reading:** [React TypeScript Cheatsheet — Forms and Events](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/) · [react.dev — Using TypeScript: DOM events](https://react.dev/learn/typescript#typing-dom-events)

## Goals

By the end of today you can, without looking anything up:

- Annotate extracted event handlers with React's event types
  (`ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, ...) and
  explain why inline handlers don't need it
- Wrap a native element with `ComponentPropsWithoutRef<'button'>` so your
  design-system component accepts everything the real element accepts
- Extend a native element's props with `interface ... extends`, using `Omit`
  when one of your props collides with a native one
- Pull the props type out of any component with `ComponentProps<typeof X>`

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```tsx
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};

type FancyButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant: "primary" | "ghost";
};
```

## Exercises

Run each with the exercise runner and edit the `.problem.tsx` file until all
tests and type checks are green. Only then compare with the `.solution.tsx`.

```bash
pnpm exercise 06-03        # all of today's exercises
pnpm exercise 06-03 2      # just exercise 02
```

1. `01-event-handlers` — React event types on extracted handlers
2. `02-wrapping-native-elements` — `ComponentPropsWithoutRef<'button'>` + your own props
3. `03-extending-with-interface` — `interface extends`, masking a colliding native prop
4. `04-componentprops-of-component` — `ComponentProps<typeof SomeComponent>`

## The TS-dev mindset for today

- **Import event types from `"react"`.** The global DOM `KeyboardEvent` is a
  different type than React's synthetic one — the annotation that fits an
  `onKeyDown` prop is React's.
- **Never hand-list native props.** `ComponentPropsWithoutRef<'button'>` is
  the complete, always-up-to-date set; intersect or extend it and `Omit`
  whatever you deliberately replace.
- Derive, don't duplicate: `ComponentProps<typeof X>` keeps wrappers correct
  when `X` changes.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
