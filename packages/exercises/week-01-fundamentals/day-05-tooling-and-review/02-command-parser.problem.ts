/**
 * Exercise 02 — Command parser (review)
 *
 * Review of days 2–4: array access under `noUncheckedIndexedAccess`,
 * narrowing, literal types, and a discriminated union as the result.
 *
 * 🎯 Implement `parseCommand`. Input is a raw chat line:
 *      "/goto 3"        → { kind: "goto"; page: 3 }     (page must parse as
 *                          a number — otherwise the command is invalid)
 *      "/search cats"   → { kind: "search"; query: "cats" }
 *                          (the query may contain spaces: "/search fat cats"
 *                          → query "fat cats")
 *      "/help"          → { kind: "help" }
 *      anything else    → null
 *    Hints: `line.split(" ")` gives `string[]`, so `parts[0]` is
 *    `string | undefined` — narrow it! `Number.isNaN` spots bad pages.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Command =
  | { kind: "goto"; page: number }
  | { kind: "search"; query: string }
  | { kind: "help" };

const parseCommand = (line: string): Command | null => {
  // TODO: split, narrow, and build the right Command (or null).
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
