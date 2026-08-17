/**
 * Exercise 01 — Function overloads
 *
 * Both functions RUN correctly, but their single union signature means every
 * caller gets `string | number` back — even when the input type fully
 * determines the output type. Overloads declare each precise call signature
 * above one implementation signature that covers them all.
 *
 * 🎯 1. Give `parseId` two overloads: `string → number` and `number → string`.
 *    2. Give `combine` two overloads: two strings → string, two numbers →
 *       number — which also makes MIXING the two an error.
 *    Keep both implementation bodies exactly as they are.
 */
import { expect, expectTypeOf, it } from "vitest";

function parseId(id: string | number): string | number {
  return typeof id === "string" ? Number.parseInt(id, 10) : `#${id}`;
}

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
