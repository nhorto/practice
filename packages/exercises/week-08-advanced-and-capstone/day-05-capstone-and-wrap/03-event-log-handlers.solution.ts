/**
 * Exercise 03 — Event log with a derived handler map (solution)
 *
 * `HandlerMap` is the union, reshaped:
 *
 *   { [K in TEvent["type"]]: (state, event: Extract<TEvent, { type: K }>) => TState }
 *
 * - `TEvent["type"]` unions all discriminants — the mapped type demands ONE
 *   key per variant, so a missing handler is a compile error (that's the
 *   exhaustiveness test) and adding a variant breaks every reducer until
 *   it's handled. Exhaustiveness by construction, not by `switch`.
 * - `Extract<TEvent, { type: K }>` narrows per key, so each handler gets
 *   its own variant — `event.count` exists in `tokens_streamed` and nowhere
 *   else, with zero annotations at the call site.
 *
 * The dispatch needs one honest cast: `handlers[event.type]` types as a
 * UNION of all handlers, and day 1 taught us what calling a union of
 * functions demands — an intersection of parameters, which one concrete
 * event never is. The compiler can't track that the key and the event are
 * CORRELATED (same K), so we assert the relationship we enforced in the
 * public types. Sound API, one documented cast at the storage boundary —
 * the same pattern as the event emitter and the builder.
 */
import { expect, expectTypeOf, it } from "vitest";

type AgentEvent =
  | { type: "prompt_submitted"; prompt: string }
  | { type: "tokens_streamed"; count: number }
  | { type: "tool_invoked"; name: string }
  | { type: "run_completed"; durationMs: number };

type HandlerMap<TEvent extends { type: string }, TState> = {
  [K in TEvent["type"]]: (
    state: TState,
    event: Extract<TEvent, { type: K }>,
  ) => TState;
};

const createReducer =
  <TEvent extends { type: string }, TState>(
    handlers: HandlerMap<TEvent, TState>,
  ) =>
  (state: TState, event: TEvent): TState => {
    const handler = handlers[event.type as TEvent["type"]] as (
      state: TState,
      event: TEvent,
    ) => TState;
    return handler(state, event);
  };

type RunStats = {
  prompts: number;
  tokens: number;
  toolCalls: string[];
  totalMs: number;
};

const reducer = createReducer<AgentEvent, RunStats>({
  prompt_submitted: (state) => ({ ...state, prompts: state.prompts + 1 }),
  tokens_streamed: (state, event) => ({
    ...state,
    tokens: state.tokens + event.count,
  }),
  tool_invoked: (state, event) => ({
    ...state,
    toolCalls: [...state.toolCalls, event.name],
  }),
  run_completed: (state, event) => ({
    ...state,
    totalMs: state.totalMs + event.durationMs,
  }),
});

// --- tests ------------------------------------------------------------------

const events: AgentEvent[] = [
  { type: "prompt_submitted", prompt: "Summarize this repo" },
  { type: "tokens_streamed", count: 120 },
  { type: "tokens_streamed", count: 80 },
  { type: "tool_invoked", name: "read_file" },
  { type: "run_completed", durationMs: 900 },
];

it("replays an event log into stats", () => {
  const stats = events.reduce(reducer, {
    prompts: 0,
    tokens: 0,
    toolCalls: [],
    totalMs: 0,
  } satisfies RunStats);
  expect(stats).toEqual({
    prompts: 1,
    tokens: 200,
    toolCalls: ["read_file"],
    totalMs: 900,
  });
});

it("narrows each handler's event parameter", () => {
  createReducer<AgentEvent, number>({
    prompt_submitted: (n, event) => {
      expectTypeOf(event).toEqualTypeOf<{
        type: "prompt_submitted";
        prompt: string;
      }>();
      return n;
    },
    tokens_streamed: (n, event) => n + event.count,
    tool_invoked: (n) => n,
    run_completed: (n) => n,
  });
  expect(true).toBe(true);
});

it("requires a handler for every event type", () => {
  // @ts-expect-error the tokens_streamed handler is missing
  createReducer<AgentEvent, number>({
    prompt_submitted: (n) => n,
    tool_invoked: (n) => n,
    run_completed: (n) => n,
  });
  expect(true).toBe(true);
});
