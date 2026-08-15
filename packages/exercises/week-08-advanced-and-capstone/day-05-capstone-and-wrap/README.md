# Day 5 — Capstone Kickoff & What to Practice Forever

**Time:** ~60 min drills, then capstone time · **Reading:** review any [book chapter](https://github.com/total-typescript/total-typescript-book/tree/main/book-content/chapters) you flagged during the course

Last day of drills. Three synthesis exercises pull the whole curriculum into
single problems — then you start the capstone.

## Capstone kickoff

The capstone lives at [`projects/06-capstone-ai-app`](../../../../projects/06-capstone-ai-app):
an AI prompt library where every pattern from the past eight weeks earns its
keep for real. Read its README today and scaffold the project. Aim for:

- **Zod at every boundary** — env vars, request bodies, LLM/tool responses.
  `z.infer` is the only way types enter the app.
- **Branded IDs** from day one — `PromptId`, `VersionId`, `UserId`. Mixing
  them up should be a compile error, not a code review comment.
- **Discriminated unions for every state** — request lifecycle, streaming
  events, tool results — each consumed by an exhaustive `switch` with a
  `never` default.
- **Generics only where two things must agree** (a schema and its handler, a
  key and its value). If a type parameter is used once, delete it.

## What to practice forever

Habits that keep the skills sharp after the course ends:

- **One [type-challenge](https://github.com/type-challenges/type-challenges) with your morning coffee.** Easy ones until they're
  boring, then mediums. Ten minutes, no peeking at solutions.
- **Read the error like a sentence, top to bottom, before touching code.**
  The bottom-most "Type X is not assignable to type Y" is usually the truth;
  everything above it is the path there.
- **Derive, don't duplicate.** Every time you write a type by hand, ask:
  could `typeof`, `keyof`, indexed access, `ReturnType`, or `z.infer` write
  it for me?
- **Let `never` prove you finished.** New union member? The exhaustive
  switches you wrote will find every place that needs updating.
- **Once a week, read real-world types**: crack open the type definitions of
  a library you use (zod, drizzle, your UI kit) and trace one public type to
  its source.

## Exercises

```bash
pnpm exercise 08-05        # all of today's exercises
pnpm exercise 08-05 2      # just exercise 02
```

1. `01-safe-result-pipeline` — generics + zod + a discriminated `Result`
2. `02-branded-ids` — branded types + a generic zod brander
3. `03-event-log-handlers` — mapped types over a union + generic dispatch

## The TS-dev mindset, forever

- **Types are a design tool, not a tax.** Every drill this week started by
  asking "what should be impossible?" — then made the compiler enforce it.
  Keep designing that way and TypeScript writes half your tests.

## Done?

Check the final day off in the [dashboard](http://localhost:3000) — and go
build the capstone.
