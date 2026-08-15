/**
 * Exercise 02 — Command parser (review, solution)
 *
 * `split` gives `string[]`, so both `name` and `rest[0]` arrive as
 * `string | undefined` — the `?? ""` and equality checks narrow them.
 * Each branch returns exactly one union member; everything else is null.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Command =
  | { kind: "goto"; page: number }
  | { kind: "search"; query: string }
  | { kind: "help" };

const parseCommand = (line: string): Command | null => {
  const [name, ...rest] = line.split(" ");

  if (name === "/goto") {
    const page = Number.parseFloat(rest[0] ?? "");
    return Number.isNaN(page) ? null : { kind: "goto", page };
  }

  if (name === "/search") {
    const query = rest.join(" ");
    return query ? { kind: "search", query } : null;
  }

  if (name === "/help") {
    return { kind: "help" };
  }

  return null;
};

// --- tests ------------------------------------------------------------------

it("parses goto with a numeric page", () => {
  expect(parseCommand("/goto 3")).toEqual({ kind: "goto", page: 3 });
  expect(parseCommand("/goto abc")).toBeNull();
  expect(parseCommand("/goto")).toBeNull();
});

it("parses search, keeping spaces in the query", () => {
  expect(parseCommand("/search cats")).toEqual({
    kind: "search",
    query: "cats",
  });
  expect(parseCommand("/search fat cats")).toEqual({
    kind: "search",
    query: "fat cats",
  });
});

it("parses help and rejects everything else", () => {
  expect(parseCommand("/help")).toEqual({ kind: "help" });
  expect(parseCommand("hello there")).toBeNull();
  expect(parseCommand("")).toBeNull();
});

it("has the correct types", () => {
  expectTypeOf(parseCommand).toEqualTypeOf<(line: string) => Command | null>();

  // The result narrows like any discriminated union:
  const command = parseCommand("/goto 3");
  if (command?.kind === "goto") {
    expectTypeOf(command.page).toEqualTypeOf<number>();
  }

  // @ts-expect-error — goto without a page is not a Command
  const bad: Command = { kind: "goto" };
  expect(bad).toBeDefined();
});
