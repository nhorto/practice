/**
 * Exercise 04 — Week review: a typed event emitter (solution)
 *
 * The whole week in ~20 lines:
 * - a constrained, defaulted-by-inference factory generic (day 1)
 * - a generic shape threaded through an API (day 2)
 * - per-method `K extends keyof TEvents` linking name to payload (days 1–2)
 * - a mapped type for the handler storage (day 4)
 * - a conditional type + `infer` to take handler types apart (day 5)
 */
import { expect, expectTypeOf, it } from "vitest";

const createEmitter = <TEvents extends Record<string, unknown>>() => {
  const handlers: {
    [K in keyof TEvents]?: Array<(payload: TEvents[K]) => void>;
  } = {};
  return {
    on: <K extends keyof TEvents>(
      event: K,
      handler: (payload: TEvents[K]) => void,
    ) => {
      const list = handlers[event] ?? [];
      list.push(handler);
      handlers[event] = list;
    },
    emit: <K extends keyof TEvents>(event: K, payload: TEvents[K]) => {
      handlers[event]?.forEach((handler) => handler(payload));
    },
  };
};

type HandlerPayload<H> = H extends (payload: infer P) => void ? P : never;

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
