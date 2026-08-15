/**
 * Exercise 02 — The exhaustive switch (solution)
 *
 * With all three cases handled, nothing reaches the `default`, so `command`
 * narrows to `never` there and the assignment compiles. Add a fourth member
 * to `Command` tomorrow and this switch stops compiling — which is the point.
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
    case "reset":
      return 0;
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
