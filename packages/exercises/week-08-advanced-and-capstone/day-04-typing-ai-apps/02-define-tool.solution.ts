/**
 * Exercise 02 — defineTool: schema-driven handler types (solution)
 *
 * `ToolConfig<TInput>` relates two fields through one type parameter:
 *
 *   input:   z.ZodType<TInput>          — a schema that PRODUCES TInput
 *   handler: (input: TInput) => string  — a function that CONSUMES it
 *
 * When you call `defineTool({...})`, TypeScript infers TInput from the schema
 * you pass — `z.object({ city: z.string(), unit: z.enum(["c","f"]) })` is a
 * `ZodType<{ city: string; unit: "c" | "f" }>` — and then CONTEXTUALLY TYPES
 * the handler's parameter with it. You write zero annotations at the call
 * site; the schema is the single source of truth.
 *
 * `runTool` keeps the same relationship: `tool.input.parse(raw)` returns
 * TInput (parse throws on bad input — that's the runtime gate), which is
 * exactly what `tool.handler` accepts. Boundary parsed, interior trusted —
 * the pattern this whole curriculum has been building toward.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

type ToolConfig<TInput> = {
  name: string;
  description: string;
  input: z.ZodType<TInput>;
  handler: (input: TInput) => string;
};

const defineTool = <TInput>(config: ToolConfig<TInput>) => config;

const runTool = <TInput>(tool: ToolConfig<TInput>, raw: unknown): string =>
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
