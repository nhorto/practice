/**
 * Exercise 01 — `interface extends` vs intersections (solution)
 *
 * Each property is declared exactly once. Had we written
 * `interface ClickEvent extends BaseEvent { id: string }` while the base said
 * `id: number`, the compiler would error right there — that early failure is
 * the whole point of preferring `extends` over `&`.
 */
import { expect, expectTypeOf, it } from "vitest";

interface BaseEvent {
  id: string;
  timestamp: number;
}

interface ClickEvent extends BaseEvent {
  x: number;
  y: number;
}

interface KeyEvent extends BaseEvent {
  key: string;
}

const describeEvent = (event: BaseEvent): string => {
  return `[${event.id.toUpperCase()}] at ${event.timestamp}`;
};

// --- tests ------------------------------------------------------------------

it("builds events that share the base shape", () => {
  const click: ClickEvent = { id: "evt_1", timestamp: 100, x: 10, y: 20 };
  const key: KeyEvent = { id: "evt_2", timestamp: 200, key: "Enter" };
  expect(describeEvent(click)).toBe("[EVT_1] at 100");
  expect(describeEvent(key)).toBe("[EVT_2] at 200");
});

it("keeps `id` a plain string on every event", () => {
  expectTypeOf<BaseEvent["id"]>().toEqualTypeOf<string>();
  expectTypeOf<ClickEvent["id"]>().toEqualTypeOf<string>();
  expectTypeOf<KeyEvent["id"]>().toEqualTypeOf<string>();
});
