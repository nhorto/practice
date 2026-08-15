/**
 * Exercise 03 — Distributivity over unions
 *
 * When the type BEFORE `extends` is a bare type parameter and you pass a
 * union, the conditional runs once per member and the results are unioned
 * back together. `Without<"a" | "b", "a">` is really
 * `Without<"a", "a"> | Without<"b", "a">` — and `never` members vanish.
 * That's the entire trick behind `Exclude` and `Extract`.
 *
 * 🎯 Implement all three (no built-in `Exclude`/`Extract` — that's what
 *    you're building):
 *    - `Extracted<T, U>` — keep the members of T assignable to U
 *    - `Without<T, U>` — drop the members of T assignable to U
 *    - `EventOf<TEvent, TKind>` — from a union of event objects, select the
 *      members whose `kind` is TKind
 */
import { expect, expectTypeOf, it } from "vitest";

type Extracted<T, U> = never; // TODO

type Without<T, U> = never; // TODO

type EventOf<TEvent, TKind> = never; // TODO

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
