/**
 * Exercise 03 — Distributivity over unions (solution)
 *
 * All three are one-line conditionals; distribution does the real work.
 * `EventOf` shows why it matters in app code: it distributes over the event
 * union, keeps the members whose `kind` matches, and never mentions any
 * event by name — add an event to the union and it just works.
 */
import { expect, expectTypeOf, it } from "vitest";

type Extracted<T, U> = T extends U ? T : never;

type Without<T, U> = T extends U ? never : T;

type EventOf<TEvent, TKind> = TEvent extends { kind: TKind } ? TEvent : never;

// --- tests ------------------------------------------------------------------

type Status = "idle" | "loading" | "success" | "error";

it("keeps only the matching members", () => {
  expectTypeOf<Extracted<Status, "success" | "error">>().toEqualTypeOf<
    "success" | "error"
  >();
  expectTypeOf<Extracted<Status, string>>().toEqualTypeOf<Status>();
});

it("drops the matching members", () => {
  expectTypeOf<Without<Status, "idle" | "loading">>().toEqualTypeOf<
    "success" | "error"
  >();
  expectTypeOf<Without<string | number | boolean, boolean>>().toEqualTypeOf<
    string | number
  >();
});

type AppEvent =
  | { kind: "click"; x: number; y: number }
  | { kind: "keypress"; key: string }
  | { kind: "scroll"; delta: number };

const handleKeypress = (event: EventOf<AppEvent, "keypress">) =>
  event.key.toUpperCase();

it("selects union members by their discriminant", () => {
  expectTypeOf<EventOf<AppEvent, "keypress">>().toEqualTypeOf<{
    kind: "keypress";
    key: string;
  }>();
  expectTypeOf<EventOf<AppEvent, "click" | "scroll">>().toEqualTypeOf<
    | { kind: "click"; x: number; y: number }
    | { kind: "scroll"; delta: number }
  >();
  expect(handleKeypress({ kind: "keypress", key: "a" })).toBe("A");
});
