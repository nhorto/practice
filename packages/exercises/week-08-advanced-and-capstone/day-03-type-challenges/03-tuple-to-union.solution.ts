/**
 * Exercise 03 — TupleToUnion (solution)
 *
 * `T[number]` is the whole trick: indexed access with the KEY TYPE `number`
 * returns everything a numeric index could produce — the union of the tuple's
 * members. For `typeof STREAM_EVENT_TYPES` (a readonly tuple of literals,
 * thanks to `as const`) that's the four event-name literals.
 *
 * The guard has a subtlety: `.includes` on a tuple of literals only accepts
 * those exact literals as its argument — useless for CHECKING an arbitrary
 * string. Widening the tuple to `readonly string[]` first lets `.includes`
 * take any string, and the `value is StreamEventType` predicate converts the
 * boolean back into a narrowing fact. One runtime list, derived type, derived
 * guard — the no-enum pattern in full.
 */
import { expect, expectTypeOf, it } from "vitest";

const STREAM_EVENT_TYPES = [
  "message_start",
  "text_delta",
  "tool_call",
  "message_stop",
] as const;

type TupleToUnion<T extends readonly unknown[]> = T[number];

type StreamEventType = TupleToUnion<typeof STREAM_EVENT_TYPES>;

const isStreamEventType = (value: string): value is StreamEventType =>
  (STREAM_EVENT_TYPES as readonly string[]).includes(value);

// --- tests ------------------------------------------------------------------

it("turns a tuple into a union of its members", () => {
  expectTypeOf<StreamEventType>().toEqualTypeOf<
    "message_start" | "text_delta" | "tool_call" | "message_stop"
  >();
  expectTypeOf<TupleToUnion<[1, 2, 3]>>().toEqualTypeOf<1 | 2 | 3>();
});

it("narrows strings with the derived guard", () => {
  const raw: string = "text_delta";
  if (isStreamEventType(raw)) {
    expectTypeOf(raw).toEqualTypeOf<StreamEventType>();
  }
  expect(isStreamEventType("text_delta")).toBe(true);
  expect(isStreamEventType("banana")).toBe(false);
});
