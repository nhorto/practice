/**
 * Exercise 02 — The exhaustive switch
 *
 * The `default` branch below assigns the leftover value to `never` — the
 * type with NO possible values. If every case is handled, nothing is left
 * over and the assignment is fine. If a case is missing, the leftover member
 * doesn't fit into `never` and the compiler points straight at it.
 *
 * That's exactly what's happening: someone added `"reset"` to `Command`
 * but forgot to handle it.
 *
 * 🎯 Read the error on `unhandled`, then add the missing case
 *    (reset → return 0). Keep the `never` default — it's the alarm system.
 */
import { expect, expectTypeOf, it } from "vitest";

type Command =
  | { type: "add"; amount: number }
  | { type: "subtract"; amount: number }
  | { type: "reset" };

const applyCommand = (total: number, command: Command): number => {
  switch (command.type) {
    case "add":
      return total + command.amount;
    case "subtract":
      return total - command.amount;
    default: {
      const unhandled: never = command;
      throw new Error(`Unhandled command: ${JSON.stringify(unhandled)}`);
    }
  }
};

// --- tests ------------------------------------------------------------------

it("adds and subtracts", () => {
  expect(applyCommand(10, { type: "add", amount: 5 })).toBe(15);
  expect(applyCommand(10, { type: "subtract", amount: 3 })).toBe(7);
});

it("resets to zero", () => {
  expect(applyCommand(99, { type: "reset" })).toBe(0);
});

it("has the correct types", () => {
  expectTypeOf(applyCommand).toEqualTypeOf<
    (total: number, command: Command) => number
  >();
  // Inside each case, `command` is narrowed to one member:
  // @ts-expect-error — reset carries no amount
  const bad: Command = { type: "reset", amount: 1 };
  expect(bad).toBeDefined();
});
