/**
 * Exercise 01 — Streaming events as a discriminated union (solution)
 *
 * Each variant carries exactly its own fields, and they all share ONE literal
 * discriminant: `type`. That buys three things:
 *
 * 1. NARROWING — `case "text_delta":` proves `event.text` exists and is a
 *    string. No optional chaining, no non-null assertions, no guessing.
 * 2. EXHAUSTIVENESS — in `default:`, TypeScript has eliminated every variant,
 *    so `event` is `never` and `assertNever(event)` compiles. Add a fifth
 *    event variant tomorrow and this switch is a COMPILE error until you
 *    handle it — the 2am failure moves to your editor, today.
 * 3. CONSTRUCTION SAFETY — you can't build a franken-event mixing fields from
 *    two variants; excess property checking rejects it (day 1!).
 *
 * This is exactly how real LLM SDKs type their streaming events.
 */
import { expect, expectTypeOf, it } from "vitest";

type StreamEvent =
  | { type: "message_start"; messageId: string }
  | { type: "text_delta"; text: string }
  | { type: "tool_call"; toolName: string; argsJson: string }
  | { type: "message_stop"; stopReason: "end_turn" | "tool_use" };

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
    case "text_delta":
      return { ...state, text: state.text + event.text };
    case "tool_call":
      return {
        ...state,
        toolCalls: [
          ...state.toolCalls,
          { toolName: event.toolName, argsJson: event.argsJson },
        ],
      };
    case "message_stop":
      return { ...state, stopReason: event.stopReason };
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
