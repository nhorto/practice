/**
 * Exercise 03 — TupleToUnion
 * (type-challenges #10 "Tuple to Union", rebuilt from scratch)
 *
 * Indexing a tuple type with `number` asks "what could ANY numeric index
 * hold?" — the union of every member. Combined with an `as const` array this
 * is the canonical way to keep ONE runtime list of allowed values and DERIVE
 * the union type from it (no enums in this curriculum, remember).
 *
 * 🎯 1. Implement `TupleToUnion` using an indexed-access lookup.
 *    2. Implement `isStreamEventType` so it narrows arbitrary strings to the
 *       derived union (you'll need to widen the tuple to search it).
 */
import { expect, expectTypeOf, it } from "vitest";

const STREAM_EVENT_TYPES = [
  "message_start",
  "text_delta",
  "tool_call",
  "message_stop",
] as const;

type TupleToUnion<T extends readonly unknown[]> = unknown;

type StreamEventType = TupleToUnion<typeof STREAM_EVENT_TYPES>;

const isStreamEventType = (value: string): value is StreamEventType => {
  // TODO: search the tuple for `value`.
  return false;
};

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
