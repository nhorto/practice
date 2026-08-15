# Day 1 — Parse, Don't Validate

**Time:** ~60–90 min · **Reading:** [Zod — Basic usage](https://zod.dev/basics) · [Zod — Defining schemas](https://zod.dev/api)

## Goals

By the end of today you can, without looking anything up:

- Explain why TypeScript types alone can't protect you from bad data (types are erased at runtime)
- Describe an object shape with `z.object` and check data against it
- Choose between `.parse` (throw) and `.safeParse` (discriminated result) and say why
- Derive a type from a schema with `z.infer` so the schema is the single source of truth

## Warm-up (5 min)

Open a scratch file and type these out from memory — don't copy/paste:

```ts
import { z } from "zod";

const UserSchema = z.object({ id: z.number(), name: z.string() });
type User = z.infer<typeof UserSchema>;

const result = UserSchema.safeParse(JSON.parse('{"id":1,"name":"Ada"}'));
if (result.success) console.log(result.data.name);
```

## Exercises

Run each with the exercise runner and edit the `.problem.ts` file until all tests
and type checks are green. Only then compare with the `.solution.ts`.

```bash
pnpm exercise 05-01        # all of today's exercises
pnpm exercise 05-01 2      # just exercise 02
```

1. `01-types-are-erased` — an `as` cast lies about JSON; replace it with a schema and `.parse`
2. `02-safeparse` — handle bad data without try/catch using `.safeParse`'s discriminated result
3. `03-infer-single-source` — delete a hand-written duplicate type and derive it with `z.infer`

## The TS-dev mindset for today

- **Types are compile-time only.** `JSON.parse(x) as User` compiles to
  `JSON.parse(x)` — the cast is deleted, and whatever the string contained
  flows through your "typed" code untouched. A schema is the runtime half your
  types never had.
- **Parse, don't validate.** Don't check data and then keep passing the
  unchecked value around — parse it once at the boundary into a value whose
  type *proves* it was checked. Inside the boundary, trust the types.
- **One source of truth.** Never write a type by hand next to a schema that
  already describes it. `z.infer<typeof Schema>` can't drift; a duplicate can.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
