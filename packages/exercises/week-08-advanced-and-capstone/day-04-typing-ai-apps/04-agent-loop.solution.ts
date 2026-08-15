/**
 * Exercise 04 — The typed agent loop (solution)
 *
 * The generic ties the whole loop together:
 *
 *   <TTools extends Record<string, (input: string) => string>>
 *
 * - `tools` fixes TTools by inference — passing our two-tool object makes
 *   `keyof TTools & string` the union "calculator" | "clock". (The `& string`
 *   strips the symbol/number possibilities `keyof` technically allows.)
 * - The model's return type `AssistantTurn<keyof TTools & string>` then
 *   REJECTS any turn naming an unregistered tool at compile time — the
 *   `@ts-expect-error` in the last test is a runtime crash that the types
 *   catch a whole deploy earlier.
 * - `tools[output.tool]` still comes back `... | undefined`: TTools is
 *   constrained by an INDEX SIGNATURE, so `noUncheckedIndexedAccess` applies.
 *   The honest guard costs two lines and doubles as runtime protection when
 *   an untyped caller (or a cast) smuggles in a bad tool name — which is
 *   exactly what the last test does.
 * - The switch on `output.kind` is the same exhaustive dispatch as exercise
 *   01: add a third turn kind and `assertNever` turns into a compile error.
 *
 * Note `clock: () => "12:00"` in the registry: a function with FEWER
 * parameters is assignable to the `(input: string) => string` slot — day 1's
 * assignability rule doing quiet, useful work.
 */
import { expect, expectTypeOf, it } from "vitest";

type AssistantTurn<TToolName extends string> =
  | { kind: "reply"; text: string }
  | { kind: "call_tool"; tool: TToolName; input: string };

const assertNever = (value: never): never => {
  throw new Error(`Unhandled turn: ${JSON.stringify(value)}`);
};

const runAgent = <TTools extends Record<string, (input: string) => string>>(
  model: (transcript: string[]) => AssistantTurn<keyof TTools & string>,
  tools: TTools,
  maxTurns = 5,
): string => {
  const transcript: string[] = [];
  for (let turn = 0; turn < maxTurns; turn += 1) {
    const output = model(transcript);
    switch (output.kind) {
      case "reply":
        return output.text;
      case "call_tool": {
        const tool = tools[output.tool];
        if (!tool) {
          throw new Error(`Unknown tool: ${output.tool}`);
        }
        transcript.push(`[${output.tool}] ${tool(output.input)}`);
        break;
      }
      default:
        return assertNever(output);
    }
  }
  return "Max turns exceeded";
};

// --- tests ------------------------------------------------------------------

const tools = {
  calculator: (input: string) => (input === "2+2" ? "4" : "unknown"),
  clock: () => "12:00", // fewer params than the slot — fine (day 1!)
};

it("loops until the model replies", () => {
  let call = 0;
  const answer = runAgent((transcript) => {
    call += 1;
    if (call === 1) {
      return { kind: "call_tool", tool: "calculator", input: "2+2" } as const;
    }
    expect(transcript).toEqual(["[calculator] 4"]);
    return { kind: "reply", text: "The answer is 4." } as const;
  }, tools);
  expect(answer).toBe("The answer is 4.");
});

it("gives up after maxTurns tool calls", () => {
  const answer = runAgent(
    () => ({ kind: "call_tool", tool: "clock", input: "" }) as const,
    tools,
    3,
  );
  expect(answer).toBe("Max turns exceeded");
});

it("types the model's contract", () => {
  runAgent((transcript) => {
    expectTypeOf(transcript).toEqualTypeOf<string[]>();
    return { kind: "reply", text: "done" } as const;
  }, tools);
});

it("only allows registered tool names", () => {
  expect(() =>
    runAgent(
      // @ts-expect-error "browser" is not a registered tool
      () => ({ kind: "call_tool", tool: "browser", input: "" }) as const,
      tools,
      1,
    ),
  ).toThrow();
});
