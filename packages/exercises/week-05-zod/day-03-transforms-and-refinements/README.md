# Day 3 — Transforms & Refinements

**Time:** ~60–90 min · **Reading:** [Zod — Transforms](https://zod.dev/api#transforms) · [Zod — Refinements](https://zod.dev/api#refinements)

## Goals

By the end of today you can, without looking anything up:

- Reshape data while parsing with `.transform()` and explain why `z.input` and `z.output` now differ
- Enforce rules a type can't express with `.refine(fn, { error })`
- Chain validate → transform → validate again with `.pipe()`
- Convert stringly-typed input with `z.coerce.*` and fill gaps with `.default()`
- Read a schema and say what goes IN (`z.input`) vs what comes OUT (`z.output`)

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```ts
import { z } from "zod";

const Tags = z.string().transform((s) => s.split(","));
type In = z.input<typeof Tags>; //  string
type Out = z.output<typeof Tags>; //  string[]

const Port = z.coerce.number().int().default(3000);
const Even = z.number().refine((n) => n % 2 === 0, { error: "must be even" });
```

## Exercises

```bash
pnpm exercise 05-03        # all of today's exercises
pnpm exercise 05-03 4      # just exercise 04
```

1. `01-transform` — parse a CSV header line into structured data; watch input/output types split
2. `02-refine` — rules types can't check: password pairs and date ranges
3. `03-coerce-and-default` — `"3000"` → `3000` and sensible fallbacks for missing keys
4. `04-pipe` — normalize, then validate the normalized value with `.pipe()`

## The TS-dev mindset for today

- **A schema is a function.** Until today, schemas were shaped like
  `unknown → T`. With transforms, they're honest functions `In → Out`, and
  zod tracks both sides: `z.input` for callers, `z.output` (= `z.infer`) for
  consumers. When they differ, never label a value with the wrong side.
- **Refine for rules, not shapes.** If the type system could check it
  (string vs number), it belongs in the base schema. `.refine` is for the
  rest: cross-field rules, ranges, invariants. Always pass `{ error: "..." }`
  so failures read like English (v4's unified error param — `message` is gone).
- **Coerce at the edge only.** `z.coerce.number()` exists because env vars
  and query strings are all strings. Inside your program, numbers should
  already be numbers.

## Today's build (~30 min)

**Project 03 — Typed API client** · [`projects/03-zod-api-client`](../../../../projects/03-zod-api-client/GUIDE.md)

**Milestone 3** — transforms: API shape into domain shape (today's exact topic).

```bash
pnpm --filter project-zod-api-client test
```

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
