# Project 06 — Capstone: AI Prompt Library + Chat Playground

**Pairs with:** Week 8 (advanced patterns; kicks off day 5, runs as long as
you like)

The capstone: a Next.js app that stores a library of reusable prompts and
lets you run them in a chat playground with **streaming** responses. It is
deliberately an *AI* app, because AI apps are boundary-validation on hard
mode — and that's the skill this whole curriculum built toward:

| Boundary | Guard |
|---|---|
| `process.env` | Zod-validated env module (t3-env pattern) |
| Database rows | Drizzle `$inferSelect` / `$inferInsert` |
| Form / action input | Zod schemas aligned to insert types |
| **Streaming chat events** | Discriminated union, exhaustively switched |
| **Tool inputs (model → app)** | Zod schemas per tool — the model is untrusted input! |
| Provider SDK responses | Mapped into *your* event union at the edge |

**You write zero CSS.** [`globals.css`](./globals.css) ships finished —
classes: `.app-shell`, `.sidebar` (+ `__brand`, `__section-title`), `.main`,
`.page-title`, `.prompt-list`, `.prompt-card` (+ `__name`, `__text`,
`__actions`), `.prompt-form`, `.form-error`, `.playground` (+ `__toolbar`,
`__provider`), `.provider-dot` / `.provider-dot--mock`, `.chat`,
`.chat__empty`, `.chat-message` (+ `--user`, `--assistant`, `--streaming`,
`__role`), `.chat-tool-call` (+ `__name`), `.chat-error`, `.chat-input`,
`.button--secondary`, `.button--danger`.

**No API key required**: milestones 1–3 and 5 run entirely on a
`MockProvider` that streams canned responses. A real Anthropic provider is
the optional milestone-4 stretch.

Scaffold the same way as project 05 (`pnpm create next-app@latest . --ts
--app --no-tailwind`, rename to `"project-capstone-ai"`, root `pnpm install`,
swap in `globals.css`), then add `zod`, `drizzle-orm`, `better-sqlite3`,
`drizzle-kit`, `@types/better-sqlite3` — see project 05 milestone 1 for the
`pnpm approve-builds` note.

---

## Milestone 1 — Design the domain types FIRST

*(week 8 — before writing any component; reference week 8 day 4,
"Typing AI/LLM apps")*

### Goal

`lib/types.ts` (pure types + Zod schemas, no I/O, no React): prompts,
chat messages, conversations, and — the centerpiece — **streaming events as
a discriminated union**.

### Types-first approach

Start from the question: *what can happen while a response streams?* Each
answer becomes a variant:

```ts
export const ROLES = ["user", "assistant"] as const;
export type Role = (typeof ROLES)[number];

export type ChatMessage = { role: Role; content: string };

export type StreamEvent =
  | { type: "message_start"; model: string }
  | { type: "text_delta"; text: string }
  | { type: "tool_call"; name: string; input: unknown }   // unknown until milestone 3 validates it!
  | { type: "message_end"; stopReason: "end" | "tool_call" | "aborted" }
  | { type: "error"; message: string };
```

Why a union and not callbacks (`onText`, `onError`, ...)? Because a union is
*data*: it can be logged, replayed, tested, sent over the wire, and — the
week-8 move — **switched exhaustively**. When you later add a
`"thinking_delta"` variant, the compiler finds every consumer. Real AI SDKs
(including Anthropic's) model their streams exactly this way; you're building
the small honest version.

Also design here:

- `Prompt`: will be DB-derived in milestone 2, but sketch the shape now —
  `{ id, name, text, createdAt }` — so the UI design has a target. Variables
  in prompt text (`{{topic}}`) are a stretch; note the idea, don't build it.
- `Conversation = { id: string; promptId: number | null; messages: ChatMessage[] }` —
  in-memory for the playground (persisting conversations is stretch).
- The **event schema**, not just the event type:
  `StreamEventSchema = z.discriminatedUnion("type", [...])` with
  `type StreamEvent = z.infer<typeof StreamEventSchema>`. You'll need it the
  moment events cross a network boundary (milestone 5 streams them from a
  route handler) — anything that crossed a wire is `unknown` until parsed.
  Zod v4 reminders: `{ error }` not `{ message }`; `z.strictObject` if you
  want event objects closed; `z.record(key, value)` takes two args.

### Definition of done

- [ ] `lib/types.ts` compiles standalone; types derived from schemas (or
      `as const` arrays) wherever a runtime counterpart exists.
- [ ] A scratch `switch (event.type)` over `StreamEvent` with a `never`
      default compiles — and breaks when you comment out a case.
- [ ] Write (in comments) which boundary each schema will guard. If a schema
      guards nothing, delete it.

---

## Milestone 2 — Drizzle persistence for prompts

*(reuses week 7 wholesale)*

### Goal

`db/schema.ts` + migration + `db/queries.ts` for the prompt library:
`listPrompts`, `getPrompt`, `createPrompt`, `updatePrompt`, `deletePrompt` —
plus Zod-validated server actions and the library UI (`.prompt-list`,
`.prompt-card`, `.prompt-form`).

### Types-first approach

This is project 05's pipeline replayed on a new domain — do it from memory
and see how much stuck:

- `prompts` table → `export type Prompt = typeof prompts.$inferSelect` —
  and now DELETE the sketched `Prompt` from milestone 1 in favor of the
  derived one. (Notice the workflow: sketch by hand, then replace with a
  derivation once a source of truth exists.)
- `PromptInputSchema` (`name` non-empty ≤ 100, `text` non-empty ≤ 4000) with
  the compile-time alignment check against `$inferInsert` from project 05
  milestone 4.
- Server actions parse `FormData` → data layer → `revalidatePath`.

### Hints

1. `drizzle.config.ts`, `db:generate`, `db:migrate` — identical shape to
   project 05; the db file can be `capstone.db`.
2. Library page = server component reading `listPrompts()`; the sidebar
   (`.sidebar`) lists prompt names as links; the main pane shows cards with
   "Run in playground" (→ `/playground?promptId=N`) and delete actions.
3. Seed 2–3 prompts via a `scripts/seed.ts` so the UI never starts empty
   ("Explain {{topic}} to a five-year-old" is a classic).

### Definition of done

- [ ] Prompt CRUD works end to end, styled, with inline validation errors.
- [ ] `Prompt` appears exactly once as a source of truth (the schema);
      everything else derives.

---

## Milestone 3 — `ChatProvider` + `MockProvider` + typed tools

*(the capstone's core)*

### Goal

`lib/provider.ts`: a provider-agnostic `ChatProvider` interface;
`lib/mock-provider.ts`: a `MockProvider` that streams canned responses (with
realistic delays) so the whole app works keyless; `lib/tools.ts`: tool
definitions whose inputs are Zod-validated.

### Types-first approach

**The interface** — this is the "interface only for extends/implements"
exception earning its keep; a contract multiple classes implement is exactly
what `interface` is for (a `type` would also work; choose and justify):

```ts
export interface ChatProvider {
  readonly name: string;
  chat(
    messages: readonly ChatMessage[],
    options?: { system?: string; signal?: AbortSignal },
  ): AsyncIterable<StreamEvent>;
}
```

`AsyncIterable<StreamEvent>` is the whole design: consumers write
`for await (const event of provider.chat(...))` and switch on `event.type`.
No callbacks, no EventEmitter, no provider types leaking out. Any provider
that can be adapted into this shape — mock, Anthropic, whatever comes next —
plugs into an unchanged UI. That's what "provider-agnostic" means concretely.

**The mock** — an `async function*` generator makes streaming trivial:
yield `message_start`, then the canned reply word-by-word as `text_delta`s
with a `~30ms` `setTimeout` between them, then `message_end`. Give it 2–3
canned scripts (keyed off the last user message, or round-robin) and one
script that emits a `tool_call` so the UI's tool rendering is exercisable
offline.

**Typed tools** — define each tool schema-first:

```ts
export const TOOLS = {
  get_time: {
    description: "Get the current time in an IANA timezone",
    inputSchema: z.object({ timezone: z.string() }),
    run: ({ timezone }: { timezone: string }) => /* Intl.DateTimeFormat ... */,
  },
  // roll_dice, etc.
} as const satisfies Record<string, ToolDef>;
```

with `ToolDef` typed so `run`'s parameter is tied to the schema
(`z.infer<typeof inputSchema>` — a small generic puzzle; week 8 day 2 energy).
The dispatcher that handles a `tool_call` event MUST
`TOOLS[name]?.inputSchema.safeParse(event.input)` before running anything:
**model output is untrusted input**. A model (or mock) that hallucinates
`{ "timezone": 42 }` produces a friendly error event, not a crash. This is
the single most transferable lesson in the capstone.

### Definition of done

- [ ] A scratch `tsx` script drives `MockProvider` and prints events —
      streaming works with zero UI and zero network.
- [ ] The event consumer switch is exhaustive (`assertNever`).
- [ ] Malformed tool input from the provider produces an `error`/text event,
      never a throw. Prove it by making the mock emit garbage input once.

---

## Milestone 4 — Stretch: a real Anthropic provider

*(optional — needs an API key)*

### Goal

`lib/anthropic-provider.ts` implementing `ChatProvider` over
`@anthropic-ai/sdk`, selected at runtime only when the (env-validated) key
exists.

### Types-first approach

**Env first.** The t3-env pattern from week 5, hand-rolled:

```ts
// lib/env.ts
const EnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-").optional(),
});
export const env = EnvSchema.parse({
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
});
```

`.optional()` is deliberate: no key is a *valid* configuration — the app
falls back to `MockProvider`. A malformed key fails fast at boot with a
Zod error instead of a confusing 401 mid-demo. Provider selection is one
typed function: `getProvider(): ChatProvider`.

**The adapter.** `pnpm add @anthropic-ai/sdk`, then map *their* stream into
*your* union — the adapter pattern that makes milestone 3's interface pay off:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

async function* chat(messages, options) {
  const stream = client.messages.stream({
    model: "claude-sonnet-5",        // example model id
    max_tokens: 1024,
    system: options?.system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  for await (const event of stream) {
    // Their events -> your StreamEvent union. Their union is bigger than
    // yours — map what you model, ignore the rest DELIBERATELY (a default
    // branch with a comment, not an error).
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield { type: "text_delta", text: event.delta.text } as const;
    }
    // message_start / message_stop / etc. — your mapping here
  }
  yield { type: "message_end", stopReason: "end" } as const;
}
```

Server-side only: the key must never reach a client component — keep the
provider behind the route handler you build in milestone 5, and let the
`.playground__provider` badge (with `.provider-dot--mock` when mocked) tell
the user which provider is live.

### Definition of done

- [ ] With no key: app runs identically on the mock (badge says mock).
- [ ] With a key: real streamed responses; with a *malformed* key: instant,
      readable boot error.
- [ ] The UI imports `ChatProvider` only — `@anthropic-ai/sdk` appears in
      exactly one file. Deleting that file (and env wiring) must not break
      typecheck anywhere else.

---

## Milestone 5 — The playground UI

### Goal

`/playground`: pick a prompt (as system text), chat with streaming rendering,
tool calls rendered as `.chat-tool-call` blocks — all on the provided CSS.

### Types-first approach

The transcript is a rendering of *your event log*, so type the UI state as a
reduction over `StreamEvent` — a reducer again, like project 04:

- Server: a route handler `app/api/chat/route.ts` that runs
  `getProvider().chat(...)` and streams events as NDJSON lines
  (`ReadableStream` from the async iterable; one `JSON.stringify(event) + "\n"`
  per event).
- Client: a `useChat()` hook that POSTs the messages, reads the body with
  `response.body.getReader()`, splits lines, and — because the wire is a
  boundary — parses each line with `StreamEventSchema` from milestone 1
  before dispatching it into local state. The schema you wrote on day one
  guards the pipe you built on the last day.
- Rendering: `.chat-message--user` / `--assistant`, the in-flight assistant
  bubble gets `--streaming` (the CSS draws the blinking cursor),
  `tool_call` events render `.chat-tool-call` with the name and pretty-printed
  input, `error` events render `.chat-error`. The switch that decides which
  block to render: exhaustive, of course.

### Hints

1. Keep the reducer pure and unit-testable if you add vitest here (worth it):
   `applyEvent(transcript, event)` — feed it a recorded event array and
   snapshot the result.
2. Abort: wire the `AbortSignal` from milestone 3's interface to a "stop"
   button; `message_end` with `stopReason: "aborted"` closes the bubble
   cleanly.
3. `Enter` sends, `Shift+Enter` newlines — a typed `KeyboardEvent` handler,
   week 6 muscle memory.

### Definition of done

- [ ] Full flow on the mock: pick prompt → send → watch it stream → see a
      tool call render → response completes. Zero CSS written.
- [ ] Kill the dev server mid-stream: the UI shows a `.chat-error`, not a
      hang — the `error` variant is reachable and rendered.
- [ ] Boundary audit (the capstone's real exit exam): list every place data
      enters the app — env, DB, forms, route-handler input, provider stream,
      tool inputs — and point at the schema or derived type guarding each.
      No entry may say "trust me".

---

## Done?

That's the curriculum. The reflex you should now have everywhere: *model the
domain in types, derive everything derivable, validate every boundary, and
make the compiler enforce the rest.* Week 8 day 5's "what to practice
forever" list is your maintenance plan — and this capstone is a living repo
to keep practicing in.
