# Day 5 — Zod Brands & Week Review

**Time:** ~60–90 min · **Reading:** [Zod — Branded types](https://zod.dev/api#branded-types) · skim the week's earlier READMEs

## Goals

By the end of today you can, without looking anything up:

- Brand a schema with `.brand<'Name'>()` and explain what it changes (types only — runtime output is untouched)
- Connect Zod brands to last week's hand-rolled branded types (`string & { __brand: ... }`) and say what the schema version adds: validation and branding in ONE step at the boundary
- Keep two same-shaped IDs (user id vs order id) from ever crossing paths
- Combine everything from this week — composition, transforms, coercion, refinement, inference — without looking things up

## Warm-up (5 min)

Type these out from memory — don't copy/paste:

```ts
import { z } from "zod";

const UserId = z.uuid().brand<"UserId">();
type UserId = z.infer<typeof UserId>; //  string & z.$brand<"UserId">

const id = UserId.parse("f2b4…"); //  the ONLY way to make a UserId
// const nope: UserId = "raw string"; //  ❌ compile error
```

## Exercises

```bash
pnpm exercise 05-05        # all of today's exercises
pnpm exercise 05-05 3      # just exercise 03
```

1. `01-branded-ids` — make "any old string" stop typechecking as a user id
2. `02-brands-at-boundaries` — two same-shaped IDs that can't be swapped
3. `03-review-webhook-pipeline` — review drill: discriminated union + transform + strict objects
4. `04-review-signup-form` — review drill: coerce + default + refine + input/output divergence

## The TS-dev mindset for today

- **A brand is a promise with a witness.** Last week you wrote
  `type UserId = string & { __brand: "UserId" }` and cast at the edge. Zod's
  `.brand<"UserId">()` makes the parse itself the only mint: if you hold a
  `UserId`, the format check already ran. No cast, no ceremony, no way to
  forge one by accident.
- **Brands are free.** `.brand()` changes nothing at runtime — same string
  comes out. All the enforcement happens in the type system, which is exactly
  where mixing up two IDs was going to hurt you.
- **The week in one sentence:** schemas guard the boundaries, `z.infer`
  carries the proof everywhere else — write the shape once, derive forever.

## Today's build (~30 min)

**Project 03 — Typed API client** · [`projects/03-zod-api-client`](../../../../projects/03-zod-api-client/GUIDE.md)

**Milestone 4** then **milestone 5** — branded IDs in the cache, then the CLI report. Finish the project.

```bash
pnpm --filter project-zod-api-client test
```

## Done?

Week 5 complete — check the day off in the [dashboard](http://localhost:3000). Next week: typed React.
