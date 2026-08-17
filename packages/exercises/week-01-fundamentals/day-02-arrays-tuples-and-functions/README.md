# Day 2 — Arrays, Tuples & More Functions

**Time:** ~60–90 min · **Reading:** [Total TypeScript Essentials — Essential Types and Annotations](https://github.com/total-typescript/total-typescript-book/blob/main/book-content/chapters/04-essential-types-and-annotations.md)

## Goals

By the end of today you can, without looking anything up:

- Explain when `number[]` is wrong and `[number, number]` is right
- Make parameters optional with `?` or a default value — and know the difference
- Type rest parameters and callback parameters
- Say what `void` means in a callback type, and why it isn't `undefined`
- Explain why `unknown` is the safe version of `any`

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
const point: [number, number] = [4, 3];
const shout = (text: string, punctuation = "!") => text.toUpperCase() + punctuation;
const sum = (...values: number[]) => values.reduce((a, b) => a + b, 0);
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 01-02        # all of today's exercises
pnpm exercise 01-02 3      # just exercise 03
```

1. `01-arrays-vs-tuples` — fixed-length, per-position types
2. `02-optional-and-default-params` — `?` and `=` on parameters
3. `03-rest-params-and-void` — `...values: number[]` and callback return types
4. `04-any-vs-unknown` — replace `any` with `unknown` and narrow your way out

## The TS-dev mindset for today

- **An array says "some amount of these"; a tuple says "exactly these, in this
  order".** If destructuring gives you `| undefined` on something you *know* is
  there, you probably wanted a tuple.
- **`void` means "I will ignore your return value"**, not "you must return
  nothing". That's why `() => number` is assignable to `() => void`.
- `any` turns the type checker off; `unknown` keeps it on and makes you prove
  what you have before you use it. When in doubt: `unknown`.

## Today's build

The project track starts on **day 3** — today is drills only.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
