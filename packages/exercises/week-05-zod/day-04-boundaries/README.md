# Day 4 — Zod at the Boundaries

**Time:** ~60–90 min · **Reading:** [Zod — Basic usage](https://zod.dev/basics) · [Zod — Customizing errors](https://zod.dev/error-customization)

## Goals

By the end of today you can, without looking anything up:

- Name the two big boundaries where unknown data enters a program: the environment and the network
- Write a schema for `process.env`-shaped data (everything is `string | undefined`) with `z.coerce`, `z.enum`, and `.default()`
- Build a small generic `createEnv` helper (the t3-env pattern) that fails fast with a readable `z.flattenError` report
- Validate a fetch response typed `unknown` so no `as` cast ever touches network data

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().default(3000),
});
const env = EnvSchema.parse(process.env);

const result = EnvSchema.safeParse({});
if (!result.success) console.log(z.flattenError(result.error).fieldErrors);
```

## Exercises

```bash
pnpm exercise 05-04        # all of today's exercises
pnpm exercise 05-04 2      # just exercise 02
```

1. `01-env-schema` — describe an app's env vars; strings-in, typed-config-out
2. `02-create-env-helper` — a generic, reusable `createEnv` that throws a readable report
3. `03-fetch-boundary` — parse JSON from a (mocked) fetch instead of casting it

## The TS-dev mindset for today

- **Boundaries are where types are born.** Inside your program, types flow
  and you never re-check. At the edges — env vars, HTTP responses, file
  contents, message queues — everything is `unknown` until a schema says
  otherwise. Validate once, at the edge, and let inference carry it from there.
- **Fail fast, fail readable.** A missing env var should crash at startup
  with the variable's name in the message — not as `undefined` three modules
  later. `z.flattenError(error).fieldErrors` gives you the per-key report.
- **`Response.json()` returns `unknown` in spirit.** The built-in type is
  `any`, which silently infects everything it touches. Treat network JSON as
  `unknown` and parse it — never `as User`.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
