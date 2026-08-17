/**
 * Exercise 03 — Typed conversation model (solution)
 *
 * Three patterns stacked:
 *
 * 1. `(typeof ROLES)[number]` — one runtime tuple, one derived union. Add a
 *    role to the array and the type updates itself (the no-enum pattern).
 *
 * 2. `Message` as a discriminated union on `role`. Now "a tool message
 *    without toolCallId" is not a runtime bug hunt, it's a compile error —
 *    and so is a user message that tries to smuggle in toolCalls.
 *
 * 3. `messagesFrom` is the day's subtlest trick:
 *      <R extends Role>(conversation: Message[], role: R) =>
 *        conversation.filter(
 *          (message): message is Extract<Message, { role: R }> => ...
 *        )
 *    `.filter` alone returns Message[] — it can't know the predicate
 *    narrowed anything. The TYPE PREDICATE tells it, and `Extract` computes
 *    "the union members whose role is R" from the generic parameter, so
 *    `messagesFrom(convo, "tool")` returns the tool variant only, fully
 *    typed, for any role you pass.
 */
import { expect, expectTypeOf, it } from "vitest";

const ROLES = ["system", "user", "assistant", "tool"] as const;

type Role = (typeof ROLES)[number];

type Message =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | {
      role: "assistant";
      content: string;
      toolCalls?: { name: string; argsJson: string }[];
    }
  | { role: "tool"; content: string; toolCallId: string };

const messagesFrom = <R extends Role>(conversation: Message[], role: R) =>
  conversation.filter(
    (message): message is Extract<Message, { role: R }> =>
      message.role === role,
  );

// --- tests ------------------------------------------------------------------

const conversation: Message[] = [
  { role: "system", content: "You are a concise assistant." },
  { role: "user", content: "What is 2 + 2?" },
  {
    role: "assistant",
    content: "Let me compute that.",
    toolCalls: [{ name: "calculator", argsJson: '{"expr":"2+2"}' }],
  },
  { role: "tool", content: "4", toolCallId: "call_1" },
  { role: "assistant", content: "It's 4." },
];

it("derives Role from the ROLES tuple", () => {
  expectTypeOf<Role>().toEqualTypeOf<"system" | "user" | "assistant" | "tool">();
  expect(ROLES).toHaveLength(4);
});

it("filters to a single variant with full type info", () => {
  const toolResults = messagesFrom(conversation, "tool");
  expect(toolResults).toEqual([
    { role: "tool", content: "4", toolCallId: "call_1" },
  ]);
  expectTypeOf(toolResults).toEqualTypeOf<
    { role: "tool"; content: string; toolCallId: string }[]
  >();
  // @ts-expect-error "moderator" is not a role
  messagesFrom(conversation, "moderator");
});

it("requires role-specific fields", () => {
  // @ts-expect-error tool messages must reference the call they answer
  const orphan: Message = { role: "tool", content: "4" };
  // @ts-expect-error users don't issue tool calls
  const weird: Message = { role: "user", content: "hi", toolCalls: [] };
  expect([orphan, weird]).toHaveLength(2);
});
