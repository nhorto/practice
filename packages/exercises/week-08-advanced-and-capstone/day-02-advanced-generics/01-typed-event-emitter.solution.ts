/**
 * Exercise 01 — Typed event emitter (solution)
 *
 * Both methods are generic over `K extends keyof Events`:
 *
 * - `on(event: K, listener: (payload: Events[K]) => void)` — passing "login"
 *   fixes K to "login", so the listener's payload is looked up as
 *   `Events["login"]`. The event name drives the payload type.
 * - `emit(event: K, payload: Events[K])` — same lookup on the sending side,
 *   so name and payload can never disagree.
 *
 * The internal casts are the honest price of erased per-key correlation: the
 * Map stores listeners for MANY different K's in one collection, and no type
 * argument can express "this Set holds listeners for exactly this key". We
 * store them as `(payload: never) => void` (the safest function type to store,
 * since nothing is callable-with-anything) and cast back at the emit site,
 * where K is known again. The PUBLIC surface stays fully sound — callers can
 * never register or emit a mismatched payload.
 */
import { expect, expectTypeOf, it } from "vitest";

const createEmitter = <Events extends Record<string, unknown>>() => {
  // Keyed by PropertyKey (not `keyof Events`) so the storage stays simple;
  // the generic methods below are what keep the public API sound.
  const listeners = new Map<PropertyKey, Set<(payload: never) => void>>();

  return {
    on<K extends keyof Events>(
      event: K,
      listener: (payload: Events[K]) => void,
    ) {
      const set =
        listeners.get(event) ?? new Set<(payload: never) => void>();
      set.add(listener as (payload: never) => void);
      listeners.set(event, set);
      return () => {
        set.delete(listener as (payload: never) => void);
      };
    },
    emit<K extends keyof Events>(event: K, payload: Events[K]) {
      listeners.get(event)?.forEach((listener) => {
        (listener as (payload: Events[K]) => void)(payload);
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
