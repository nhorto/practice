/**
 * Exercise 01 — `interface extends` vs intersections
 *
 * There are two ways to combine object types: intersections (`A & B`) and
 * `interface extends`. They look interchangeable — until a property clashes.
 * An intersection never complains: clashing property types get intersected,
 * and `string & number` silently collapses to `never`. `interface extends`
 * refuses to compile the conflict, with an error pointing at the exact
 * property. That loud, early error is why `extends` wins for hierarchies.
 *
 * 🎯 `id` was re-declared with a different type, and the intersections
 *    swallowed it — `ClickEvent["id"]` is `never`. Rewrite `BaseEvent`,
 *    `ClickEvent`, and `KeyEvent` as interfaces using `extends`, declaring
 *    `id` ONCE (as a string) on the base.
 */
import { expect, expectTypeOf, it } from "vitest";

type BaseEvent = {
  id: number;
  timestamp: number;
};

type ClickEvent = BaseEvent & {
  id: string; // clashes with BaseEvent's `id: number` — silently `never`
  x: number;
  y: number;
};

type KeyEvent = BaseEvent & {
  id: string;
  key: string;
};

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
