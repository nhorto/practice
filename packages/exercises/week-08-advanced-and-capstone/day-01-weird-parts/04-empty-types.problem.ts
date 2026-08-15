/**
 * Exercise 04 — Evolving arrays and the three "empty" types
 *
 * Part 1: an unannotated empty array gets an "evolving" type — TypeScript
 * watches what you push and unions it all together. Convenient, but nothing
 * stops a wrong-typed push from silently widening the array.
 *
 * Part 2: TypeScript has three types that all look like "empty object" but
 * mean wildly different things:
 *   - `{}`                     — "anything except null/undefined" (even "hi"!)
 *   - `object`                 — any non-primitive value
 *   - `Record<string, never>`  — an object with NO usable properties
 *
 * 🎯 1. Annotate `tags` so the bad push becomes a compile error, then fix
 *       the pushed value to the string "zod".
 *    2. Replace the three `unknown` placeholders with the correct type for
 *       each description. The assertions in the tests define the contract.
 */
import { expect, expectTypeOf, it } from "vitest";

// Part 1 — `tags` evolves: after these pushes it is (string | number)[].
const tags = [];
tags.push("typescript");
tags.push(42);

// Part 2 — three very different "empties". `unknown` is wrong for all three.
type AnythingButNullish = unknown;
type AnyObject = unknown;
type EmptyObject = unknown;

// --- tests ------------------------------------------------------------------

it("keeps tags a string array", () => {
  expect(tags).toEqual(["typescript", "zod"]);
  expectTypeOf(tags).toEqualTypeOf<string[]>();
});

it("distinguishes {} from object from Record<string, never>", () => {
  const a: AnythingButNullish = "even primitives are fine";
  const b: AnythingButNullish = 42;
  // @ts-expect-error null is one of the two things `{}` rules out
  const c: AnythingButNullish = null;

  const d: AnyObject = { anything: true };
  const e: AnyObject = [1, 2, 3];
  // @ts-expect-error primitives are not objects
  const f: AnyObject = "nope";

  const g: EmptyObject = {};
  // @ts-expect-error a populated object is not "empty"
  const h: EmptyObject = { sneaky: true };

  expect([a, b, c, d, e, f, g, h]).toHaveLength(8);
});
