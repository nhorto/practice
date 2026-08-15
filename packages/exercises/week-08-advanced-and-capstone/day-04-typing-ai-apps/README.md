# Day 4 — Typing AI Apps

**Time:** ~2 h · **Reading:** [Zod docs](https://zod.dev) (refresh `z.infer`, `safeParse`, transforms) — today is self-contained, no SDK required

Everything an LLM app throws at you is a typing problem you already know how
to solve: streaming events are a discriminated union, tool definitions are
schema-driven generics, conversations are literal-union roles, and the agent
loop is an exhaustive state machine. Today you build the typed skeleton of an
AI app from those four pieces — no SDK, just the patterns every SDK uses.

## Goals

By the end of today you can, without looking anything up:

- Model a streaming protocol as a discriminated union and fold it with an
  exhaustive `switch` (with a `never` default that actually compiles)
- Write `defineTool` so a Zod schema is the single source of truth for the
  handler's input type
- Derive message roles from one `as const` list and give each role its own
  variant in a `Message` union
- Type an agent loop generically over its registered tools, so unknown tool
  names die at compile time

## Warm-up (5 min)

Type from memory:

```ts
type Event = { type: "delta"; text: string } | { type: "stop" };
const schema = z.object({ city: z.string() });
type Input = z.infer<typeof schema>;
const assertNever = (value: never): never => {
  throw new Error(`Unexpected: ${JSON.stringify(value)}`);
};
```

## Exercises

```bash
pnpm exercise 08-04        # all of today's exercises
pnpm exercise 08-04 2      # just exercise 02
```

1. `01-streaming-events` — the wire protocol as a discriminated union
2. `02-define-tool` — a Zod schema drives the handler's inferred input
3. `03-conversation-model` — roles as literal unions, one variant per role
4. `04-agent-loop` — wire it all together into a typed loop

## The TS-dev mindset for today

- **The discriminant is the API.** Every good streaming protocol hangs
  everything off one literal field (`type`). Model it that way and narrowing,
  exhaustiveness, and future-proofing all come free.
- **Parse, don't trust.** Tool input arrives as `unknown`. The Zod schema is
  both the runtime gate and the compile-time type — one definition, both
  worlds. Never write the type by hand next to the schema.

## Done?

Check the day off in the [dashboard](http://localhost:3000) and skim tomorrow's README.
