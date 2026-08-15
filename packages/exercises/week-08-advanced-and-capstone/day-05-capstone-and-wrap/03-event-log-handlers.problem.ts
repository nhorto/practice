/**
 * Exercise 03 — Event log with a derived handler map (synthesis drill)
 *
 * The final boss: a reducer whose HANDLER MAP TYPE is computed from the event
 * union. One handler per `type`, each receiving the already-narrowed event —
 * and adding a new event variant makes every reducer definition a compile
 * error until it handles it. Mapped types + discriminated unions + Extract +
 * generics, all pulling together.
 *
 * 🎯 1. Implement `HandlerMap<TEvent, TState>`: map over `TEvent["type"]`,
 *       and give each key a handler `(state, event) => state` whose event is
 *       `Extract<TEvent, { type: K }>`.
 *    2. Fix `createReducer`'s dispatch: look up the handler for
 *       `event.type` and call it. The lookup loses the key↔event
 *       correlation, so one internal cast is expected — keep the public
 *       types sound.
 */
import { expect, expectTypeOf, it } from "vitest";

type AgentEvent =
  | { type: "prompt_submitted"; prompt: string }
  | { type: "tokens_streamed"; count: number }
  | { type: "tool_invoked"; name: string }
  | { type: "run_completed"; durationMs: number };

// TODO: derive this from TEvent instead of accepting any handler bag.
type HandlerMap<TEvent extends { type: string }, TState> = Record<
  string,
  (state: TState, event: TEvent) => TState
>;

const createReducer =
  <TEvent extends { type: string }, TState>(
    handlers: HandlerMap<TEvent, TState>,
  ) =>
  (state: TState, event: TEvent): TState => {
    // TODO: dispatch to the right handler.
    return state;
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
