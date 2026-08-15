/**
 * Exercise 01 — Typed event emitter
 *
 * The event-map pattern: a single type argument (`Events`) maps event names to
 * payload types, and every method is generic over `K extends keyof Events` so
 * the payload type is LOOKED UP from the event name. Right now `on` and `emit`
 * accept any string and treat every payload as `unknown` — the map is ignored.
 *
 * 🎯 Make `on` and `emit` generic over the event name so that:
 *    - event names outside `keyof Events` are rejected,
 *    - listener payloads are inferred as `Events[K]`,
 *    - `emit` only accepts the payload type registered for that event.
 *    The runtime bodies already work — this is a types-only fix.
 */
import { expect, expectTypeOf, it } from "vitest";

const createEmitter = <Events extends Record<string, unknown>>() => {
  const listeners = new Map<PropertyKey, Set<(payload: never) => void>>();

  return {
    on(event: string, listener: (payload: unknown) => void) {
      const set =
        listeners.get(event) ?? new Set<(payload: never) => void>();
      set.add(listener as (payload: never) => void);
      listeners.set(event, set);
      return () => {
        set.delete(listener as (payload: never) => void);
      };
    },
    emit(event: string, payload: unknown) {
      listeners.get(event)?.forEach((listener) => {
        (listener as (payload: unknown) => void)(payload);
      });
    },
  };
};

// --- tests ------------------------------------------------------------------

type AppEvents = {
  login: { userId: string };
  logout: undefined;
  "cart:add": { sku: string; qty: number };
};

it("delivers payloads to the right listeners", () => {
  const emitter = createEmitter<AppEvents>();
  const seen: string[] = [];
  emitter.on("login", (payload) => {
    seen.push(`login:${payload.userId}`);
  });
  emitter.on("cart:add", (payload) => {
    seen.push(`add:${payload.sku}x${payload.qty}`);
  });
  emitter.emit("login", { userId: "u1" });
  emitter.emit("cart:add", { sku: "ts-book", qty: 2 });
  emitter.emit("logout", undefined);
  expect(seen).toEqual(["login:u1", "add:ts-bookx2"]);
});

it("unsubscribes via the returned function", () => {
  const emitter = createEmitter<AppEvents>();
  let count = 0;
  const off = emitter.on("login", () => {
    count += 1;
  });
  emitter.emit("login", { userId: "u1" });
  off();
  emitter.emit("login", { userId: "u2" });
  expect(count).toBe(1);
});

it("ties payload types to event names", () => {
  const emitter = createEmitter<AppEvents>();
  emitter.on("login", (payload) => {
    expectTypeOf(payload).toEqualTypeOf<{ userId: string }>();
  });
  // @ts-expect-error unknown event names are rejected
  emitter.on("typo", () => {});
  // @ts-expect-error wrong payload shape for this event
  emitter.emit("cart:add", { userId: "nope" });
});
