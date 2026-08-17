/**
 * Exercise 04 — The typed agent loop
 *
 * The whole day in one function. An agent loop is: ask the model, and either
 * it replies (done) or it requests a tool call — run the tool, append the
 * result to the transcript, ask again. The pieces you've built all reappear:
 * the model's output is a discriminated union, the tools are a typed map, and
 * the loop dispatches exhaustively.
 *
 * 🎯 Type `runAgent`. It must be generic over the registered tools
 *    (`TTools extends Record<string, (input: string) => string>`) so that:
 *    - the model function receives the transcript (string[]) and returns an
 *      `AssistantTurn<keyof TTools & string>`,
 *    - a model that names an unregistered tool is a COMPILE error,
 *    - the switch on `output.kind` stays exhaustive (never default).
 *    The body's logic is already correct.
 */
import { expect, expectTypeOf, it } from "vitest";

type AssistantTurn<TToolName extends string> =
  | { kind: "reply"; text: string }
  | { kind: "call_tool"; tool: TToolName; input: string };

const assertNever = (value: never): never => {
  throw new Error(`Unhandled turn: ${JSON.stringify(value)}`);
};

const runAgent = (model, tools, maxTurns = 5) => {
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
