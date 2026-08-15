/**
 * Exercise 03 — Fetch states (solution)
 *
 * Three mutually exclusive states, each carrying only its own data. The
 * switch narrows `state` in every case, and the `never` default guarantees
 * we'll hear about it at compile time if a fourth state ever appears.
 */
import { expect, expectTypeOf, it } from "vitest";

export type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

const renderState = (state: RequestState): string => {
  switch (state.status) {
    case "loading":
      return "Loading…";
    case "success":
      return `${state.data.length} result(s)`;
    case "error":
      return `Error: ${state.message}`;
    default: {
      const unhandled: never = state;
      throw new Error(`Unhandled state: ${JSON.stringify(unhandled)}`);
    }
  }
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
