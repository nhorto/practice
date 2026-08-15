/**
 * Exercise 04 — Week 4 review drill
 *
 * Five small fixes, one from each day this week, in one file. No new ideas —
 * if any step takes more than a couple of minutes, revisit that day's
 * README.
 *
 * 🎯 1. (day 3) Replace the `LogLevel` enum with an `as const` object plus a
 *       derived union of the same name.
 *    2. (day 1) `LogEntry` is a type — export it the way
 *       `verbatimModuleSyntax` demands.
 *    3. (day 4) `levelPrefix` is missing a case — the `assertNever` default
 *       is already pointing at it. Error levels print `[err]`.
 *    4. (day 2) The last entry of an empty log is `undefined` — handle it
 *       (the fallback message is in the tests).
 *    5. (day 5) Brand `RequestId` so raw strings can't sneak past
 *       `requestId()`.
 */
import { expect, expectTypeOf, it } from "vitest";

// (1) --- enum → as const ----------------------------------------------------

enum LogLevel {
  Debug = "debug",
  Info = "info",
  Error = "error",
}

// (2) --- export type --------------------------------------------------------

type LogEntry = { level: LogLevel; message: string };

export { LogEntry };

// (3) --- exhaustive switch --------------------------------------------------

const assertNever = (value: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
};

const levelPrefix = (level: LogLevel): string => {
  switch (level) {
    case LogLevel.Debug:
      return "[dbg]";
    case LogLevel.Info:
      return "[inf]";
    default:
      return assertNever(level);
  }
};

// (4) --- unchecked indexed access -------------------------------------------

const lastMessage = (entries: LogEntry[]): string => {
  const last = entries[entries.length - 1];
  return last.message;
};

// (5) --- branded id ---------------------------------------------------------

type RequestId = string;

const requestId = (raw: string): RequestId => raw as RequestId;

const logFor = (id: RequestId, message: string): string => `[${id}] ${message}`;

// --- tests ------------------------------------------------------------------

it("levels are plain strings", () => {
  expect(Object.values(LogLevel)).toEqual(["debug", "info", "error"]);
  expectTypeOf<LogLevel>().toEqualTypeOf<"debug" | "info" | "error">();
});

it("prefixes every level", () => {
  expect(levelPrefix("debug")).toBe("[dbg]");
  expect(levelPrefix("info")).toBe("[inf]");
  expect(levelPrefix("error")).toBe("[err]");
});

it("handles an empty log", () => {
  expect(lastMessage([{ level: "info", message: "booted" }])).toBe("booted");
  expect(lastMessage([])).toBe("(no entries)");
});

it("brands request ids", () => {
  expect(logFor(requestId("req_1"), "hello")).toBe("[req_1] hello");
  // @ts-expect-error — raw strings must go through requestId()
  logFor("req_1", "hello");
  expectTypeOf<RequestId>().not.toEqualTypeOf<string>();
});
