/**
 * Exercise 03 — Fetch states
 *
 * The classic use of discriminated unions: request state. A request is
 * loading, OR it succeeded with data, OR it failed with a message — never
 * two of those at once. Model it that way and "success but data is
 * undefined" becomes impossible to represent.
 *
 * 🎯 1. Replace the placeholder `RequestState` with a union of:
 *         { status: "loading" }
 *         { status: "success"; data: string[] }
 *         { status: "error"; message: string }
 *    2. Implement `renderState` with an exhaustive switch (never default):
 *         loading → "Loading…"
 *         success → "3 result(s)" (the length of data)
 *         error   → "Error: <message>"
 */
import { expect, expectTypeOf, it } from "vitest";

export type RequestState = unknown; // TODO: replace with the union

const renderState = (state: RequestState): string => {
  // TODO: switch on state.status, never default.
};

// --- tests ------------------------------------------------------------------

it("renders each state", () => {
  expect(renderState({ status: "loading" })).toBe("Loading…");
  expect(
    renderState({ status: "success", data: ["a", "b", "c"] }),
  ).toBe("3 result(s)");
  expect(renderState({ status: "error", message: "timeout" })).toBe(
    "Error: timeout",
  );
});

it("has the correct types", () => {
  expectTypeOf<RequestState>().toEqualTypeOf<
    | { status: "loading" }
    | { status: "success"; data: string[] }
    | { status: "error"; message: string }
  >();
  expectTypeOf(renderState).returns.toEqualTypeOf<string>();

  // Impossible states don't compile:
  // @ts-expect-error — success must carry data
  const bad: RequestState = { status: "success" };
  expect(bad).toBeDefined();
});
