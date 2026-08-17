/**
 * Exercise 04 — Evolving arrays and the three "empty" types (solution)
 *
 * Part 1: `const tags = []` starts life as `any[]` and "evolves" from the
 * pushes it sees — pushing a string and a number quietly produced
 * `(string | number)[]`. The fix is to declare intent up front:
 * `const tags: string[] = []` turns the bad push into a compile error.
 * Rule of thumb: ALWAYS annotate empty arrays.
 *
 * Part 2: the three empties, decoded:
 * - `{}` means "any value on which you can access zero properties" — that is
 *   everything except `null` and `undefined`. Strings and numbers qualify!
 *   It almost never means what people hope; reach for it only as a
 *   "non-nullish" constraint.
 * - `object` is any non-primitive: objects, arrays, functions — but not
 *   strings or numbers.
 * - `Record<string, never>` is the only one that actually means "an empty
 *   object": every property would have to be `never`, so no real property
 *   can be present.
 */
import { expect, expectTypeOf, it } from "vitest";

// Part 1 — the annotation stops evolution; wrong-typed pushes now error.
const tags: string[] = [];
tags.push("typescript");
tags.push("zod");

// Part 2 — the right type for each description.
type AnythingButNullish = {};
type AnyObject = object;
type EmptyObject = Record<string, never>;

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
