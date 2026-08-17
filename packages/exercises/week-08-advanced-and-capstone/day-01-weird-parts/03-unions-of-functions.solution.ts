/**
 * Exercise 03 — Unions of functions (solution)
 *
 * Each `listener` in the loop is `IdListener | TimeListener`. To call it,
 * the argument must satisfy BOTH possible signatures, i.e. the intersection
 * of their parameter types:
 *
 *   { id: string } & { timestamp: number }
 *
 * The original `emit` had it backwards: a UNION parameter means "I might only
 * have an id" — which the TimeListener can't accept. Flipping union to
 * intersection (written here as one flat object type, which is the same
 * thing) makes every call safe.
 *
 * Mnemonic: a union of functions takes an intersection of parameters —
 * function parameters are contravariant, so the union/intersection flips.
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

// `{ id: string; timestamp: number }` is assignable to the intersection of
// both parameter types, so the union of functions is callable with it.
const emit = (event: { id: string; timestamp: number }) => {
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
