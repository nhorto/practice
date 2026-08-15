/**
 * Exercise 02 — defineTool: schema-driven handler types
 *
 * A tool definition has a Zod schema for its input and a handler that
 * receives the parsed input. In the version below the schema and the handler
 * are STRANGERS: the schema is "some ZodType", so every handler gets
 * `unknown` and has to re-narrow input the schema already validated.
 *
 * 🎯 Make `defineTool` (and `runTool`) generic over the schema's output type
 *    so the handler's `input` parameter is INFERRED from the schema — one
 *    source of truth, zero hand-written input types. `z.ZodType<T>` is the
 *    shape you want to constrain against.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

type ToolConfig = {
  name: string;
  description: string;
  input: z.ZodType;
  handler: (input: unknown) => string;
};

const defineTool = (config: ToolConfig) => config;

const runTool = (tool: ToolConfig, raw: unknown): string =>
  tool.handler(tool.input.parse(raw));

const weatherTool = defineTool({
  name: "get_weather",
  description: "Look up current weather for a city",
  input: z.object({ city: z.string(), unit: z.enum(["c", "f"]) }),
  handler: (input) => `${input.city}: 21°${input.unit}`,
});

const searchTool = defineTool({
  name: "search_notes",
  description: "Full-text search over saved notes",
  input: z.object({ query: z.string(), limit: z.number().int().positive() }),
  handler: (input) => `${input.limit} results for "${input.query}"`,
});

// --- tests ------------------------------------------------------------------

it("runs the handler on parsed input", () => {
  expect(runTool(weatherTool, { city: "Oslo", unit: "c" })).toBe("Oslo: 21°c");
  expect(runTool(searchTool, { query: "zod", limit: 3 })).toBe(
    '3 results for "zod"',
  );
});

it("rejects malformed input before the handler ever runs", () => {
  expect(() => runTool(weatherTool, { city: 42, unit: "c" })).toThrow();
  expect(() => runTool(searchTool, { query: "zod" })).toThrow();
});

it("infers each handler's input from its schema", () => {
  expectTypeOf(weatherTool.handler)
    .parameter(0)
    .toEqualTypeOf<{ city: string; unit: "c" | "f" }>();
  expectTypeOf(searchTool.handler)
    .parameter(0)
    .toEqualTypeOf<{ query: string; limit: number }>();
});
