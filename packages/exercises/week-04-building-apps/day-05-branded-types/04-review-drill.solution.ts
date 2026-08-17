/**
 * Exercise 04 — Week 4 review drill (solution)
 *
 * The week in one file: `as const` + derived union instead of an enum,
 * `export type` for types, `assertNever` keeping switches exhaustive,
 * indexed access handled honestly, and a branded id with one constructor.
 */
import { expect, expectTypeOf, it } from "vitest";

// (1) --- enum → as const ----------------------------------------------------

const LogLevel = {
  Debug: "debug",
  Info: "info",
  Error: "error",
} as const;

type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

// (2) --- export type --------------------------------------------------------

type LogEntry = { level: LogLevel; message: string };

export type { LogEntry };

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
    case LogLevel.Error:
      return "[err]";
    default:
      return assertNever(level);
  }
};

// (4) --- unchecked indexed access -------------------------------------------

const lastMessage = (entries: LogEntry[]): string =>
  entries.at(-1)?.message ?? "(no entries)";

// (5) --- branded id ---------------------------------------------------------

type RequestId = string & { readonly __brand: "RequestId" };

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
