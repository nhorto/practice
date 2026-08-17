/**
 * Exercise 03 — Unions of functions
 *
 * When you call a value whose type is a UNION of function types, TypeScript
 * has no idea which member you're holding — so the argument must be safe for
 * EVERY member. In practice: the parameter type becomes the INTERSECTION of
 * all the members' parameter types.
 *
 * 🎯 `emit` looks reasonable — "an event is one of the two shapes" — but
 *    TypeScript refuses to call the listeners with it. Fix `emit`'s parameter
 *    type so every listener in the array can safely receive the event.
 */
import { expect, expectTypeOf, it } from "vitest";

type IdListener = (event: { id: string }) => void;
type TimeListener = (event: { timestamp: number }) => void;

const log: string[] = [];

const logIds: IdListener = (event) => {
  log.push(`id=${event.id}`);
};

const logTimes: TimeListener = (event) => {
  log.push(`t=${event.timestamp}`);
};

// Inferred as (IdListener | TimeListener)[] — each element might be either.
const listeners = [logIds, logTimes];

const emit = (event: { id: string } | { timestamp: number }) => {
  for (const listener of listeners) {
    listener(event);
  }
};

// --- tests ------------------------------------------------------------------

it("notifies every listener", () => {
  log.length = 0;
  emit({ id: "evt_1", timestamp: 1700000000 });
  expect(log).toEqual(["id=evt_1", "t=1700000000"]);
});

it("requires an event that every listener can accept", () => {
  expectTypeOf(emit).toBeCallableWith({ id: "x", timestamp: 1 });
  // @ts-expect-error missing timestamp — the TimeListener in the array
  // could not handle this event.
  emit({ id: "only-an-id" });
});
