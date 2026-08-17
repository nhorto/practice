/**
 * Exercise 01 — Function overloads (solution)
 *
 * Callers only see the overload signatures — the implementation signature
 * (the union one) is hidden from them and just has to be wide enough to
 * cover every overload. Bonus: because no overload accepts a string AND a
 * number, mixing kinds is now a compile error.
 */
import { expect, expectTypeOf, it } from "vitest";

function parseId(id: string): number;
function parseId(id: number): string;
function parseId(id: string | number): string | number {
  return typeof id === "string" ? Number.parseInt(id, 10) : `#${id}`;
}

function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string | number, b: string | number): string | number {
  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }
  throw new Error("cannot combine mixed types");
}

// --- tests ------------------------------------------------------------------

it("converts between id representations", () => {
  expect(parseId("42")).toBe(42);
  expect(parseId(7)).toBe("#7");
});

it("gives callers the specific return type", () => {
  expectTypeOf(parseId("42")).toEqualTypeOf<number>();
  expectTypeOf(parseId(7)).toEqualTypeOf<string>();
  // with the union signature this arithmetic wouldn't compile:
  const doubled = parseId("21") * 2;
  expect(doubled).toBe(42);
});

it("combines two values of the same kind", () => {
  expect(combine("type", "script")).toBe("typescript");
  expect(combine(20, 22)).toBe(42);
  expectTypeOf(combine("type", "script")).toEqualTypeOf<string>();
  expectTypeOf(combine(20, 22)).toEqualTypeOf<number>();
});

it("rejects mixing kinds at compile time", () => {
  // @ts-expect-error — a string and a number can't be combined
  expect(() => combine("a", 1)).toThrow("cannot combine mixed types");
});
