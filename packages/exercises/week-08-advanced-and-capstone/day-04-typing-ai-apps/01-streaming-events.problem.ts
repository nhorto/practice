/**
 * Exercise 01 — Streaming events as a discriminated union
 *
 * A streaming LLM response arrives as a sequence of typed events. The type
 * below is how they look fresh off the wire in an untyped codebase: one bag
 * of optionals, where nothing connects `type` to which fields actually exist.
 * The reducer can't narrow, the compiler can't check exhaustiveness, and a
 * new event type would fail silently at 2am.
 *
 * 🎯 1. Redesign `StreamEvent` as a discriminated union — one member per
 *       `type`, each carrying ONLY its own fields (no optionals).
 *    2. Complete `applyEvent`'s switch: "text_delta" appends text,
 *       "tool_call" pushes onto toolCalls, "message_stop" records the
 *       stopReason. The `never` default must compile.
 */
import { expect, expectTypeOf, it } from "vitest";

type StreamEvent = {
  type: string;
  messageId?: string;
  text?: string;
  toolName?: string;
  argsJson?: string;
  stopReason?: "end_turn" | "tool_use";
};

type StreamState = {
  messageId: string | null;
  text: string;
  toolCalls: { toolName: string; argsJson: string }[];
  stopReason: "end_turn" | "tool_use" | null;
};

const initialState: StreamState = {
  messageId: null,
  text: "",
  toolCalls: [],
  stopReason: null,
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled event: ${JSON.stringify(value)}`);
};

const applyEvent = (state: StreamState, event: StreamEvent): StreamState => {
  switch (event.type) {
    case "message_start":
      return { ...state, messageId: event.messageId };
    // TODO: handle "text_delta", "tool_call", and "message_stop".
    default:
      return assertNever(event);
  }
};

// --- tests ------------------------------------------------------------------

const stream: StreamEvent[] = [
  { type: "message_start", messageId: "msg_1" },
  { type: "text_delta", text: "Let me check " },
  { type: "text_delta", text: "the weather." },
  { type: "tool_call", toolName: "get_weather", argsJson: '{"city":"Oslo"}' },
  { type: "message_stop", stopReason: "tool_use" },
];

it("folds a stream of events into final state", () => {
  const final = stream.reduce(applyEvent, initialState);
  expect(final).toEqual({
    messageId: "msg_1",
    text: "Let me check the weather.",
    toolCalls: [{ toolName: "get_weather", argsJson: '{"city":"Oslo"}' }],
    stopReason: "tool_use",
  });
});

it("narrows events by their discriminant", () => {
  const event = stream[3]!;
  if (event.type === "tool_call") {
    expectTypeOf(event).toEqualTypeOf<{
      type: "tool_call";
      toolName: string;
      argsJson: string;
    }>();
  }
  expect(event.type).toBe("tool_call");
});

it("rejects events that mix fields across variants", () => {
  // @ts-expect-error a text_delta event has no stopReason field
  const bad: StreamEvent = { type: "text_delta", text: "x", stopReason: "end_turn" };
  expect(bad).toBeDefined();
});
