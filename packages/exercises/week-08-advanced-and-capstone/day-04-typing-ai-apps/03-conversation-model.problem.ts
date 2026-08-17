/**
 * Exercise 03 — Typed conversation model
 *
 * A conversation is a list of messages with different roles — and different
 * roles carry different fields: tool results must reference the call they
 * answer, assistants may request tool calls, users and system prompts are
 * plain text. The baggy model below types every message the same, so none of
 * that is enforced.
 *
 * 🎯 1. Derive `Role` from the ROLES tuple (indexed access — no enums, no
 *       duplicated string unions).
 *    2. Redesign `Message` as a discriminated union on `role`:
 *       - system / user: just `content`
 *       - assistant: `content` plus optional `toolCalls`
 *         (`{ name: string; argsJson: string }[]`)
 *       - tool: `content` plus required `toolCallId`
 *    3. Make `messagesFrom` generic over a role `R` and return only the
 *       matching variant — `Extract<Message, { role: R }>[]` — via a type
 *       predicate on the filter callback.
 */
import { expect, expectTypeOf, it } from "vitest";

const ROLES = ["system", "user", "assistant", "tool"] as const;

type Role = string;

type Message = {
  role: string;
  content: string;
  toolCallId?: string;
  toolCalls?: { name: string; argsJson: string }[];
};

const messagesFrom = (conversation: Message[], role: string) =>
  conversation.filter((message) => message.role === role);

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
