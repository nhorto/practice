/**
 * Exercise 04 — Week review: a typed event emitter
 *
 * Everything from this week in one exercise. This emitter works at runtime,
 * but it's stringly-typed: any event name goes, and every payload is
 * `unknown`. Your job is the full generic treatment.
 *
 * 🎯 1. Make `createEmitter` generic: `<TEvents extends Record<string,
 *       unknown>>` (day 1: constraints; day 2: generic shapes). Type
 *       `handlers` so each key holds handlers for ITS payload — the mapped
 *       type from day 4:
 *         { [K in keyof TEvents]?: Array<(payload: TEvents[K]) => void> }
 *    2. Give `on` and `emit` their own `<K extends keyof TEvents>` so the
 *       payload type follows the event name (day 2: per-method generics).
 *    3. Implement `HandlerPayload` with a conditional type + `infer`
 *       (today): the payload type a handler function accepts.
 */
import { expect, expectTypeOf, it } from "vitest";

const createEmitter = () => {
  const handlers: Record<string, Array<(payload: unknown) => void>> = {};
  return {
    on: (event: string, handler: (payload: unknown) => void) => {
      const list = handlers[event] ?? [];
      list.push(handler);
      handlers[event] = list;
    },
    emit: (event: string, payload: unknown) => {
      handlers[event]?.forEach((handler) => handler(payload));
    },
  };
};

type HandlerPayload<H> = never; // TODO — conditional + infer

// --- tests ------------------------------------------------------------------

type PlayerEvents = {
  play: { trackId: string };
  volumechange: { level: number };
};

it("delivers typed payloads to handlers", () => {
  const emitter = createEmitter<PlayerEvents>();
  const played: string[] = [];
  emitter.on("play", (payload) => {
    expectTypeOf(payload).toEqualTypeOf<{ trackId: string }>();
    played.push(payload.trackId);
  });
  emitter.emit("play", { trackId: "t1" });
  emitter.emit("play", { trackId: "t2" });
  expect(played).toEqual(["t1", "t2"]);
});

it("supports multiple events and handlers", () => {
  const emitter = createEmitter<PlayerEvents>();
  const seen: number[] = [];
  emitter.on("volumechange", ({ level }) => seen.push(level));
  emitter.on("volumechange", ({ level }) => seen.push(level * 10));
  emitter.emit("volumechange", { level: 7 });
  expect(seen).toEqual([7, 70]);
});

it("rejects unknown events and wrong payloads", () => {
  const emitter = createEmitter<PlayerEvents>();
  // @ts-expect-error — "pause" is not a declared event
  emitter.on("pause", () => {});
  // @ts-expect-error — volumechange's payload is { level: number }
  emitter.emit("volumechange", { trackId: "t1" });
});

it("extracts a handler's payload type", () => {
  expectTypeOf<
    HandlerPayload<(payload: { level: number }) => void>
  >().toEqualTypeOf<{ level: number }>();
  expectTypeOf<HandlerPayload<string>>().toEqualTypeOf<never>();
});
