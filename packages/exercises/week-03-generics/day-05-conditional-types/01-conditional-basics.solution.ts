/**
 * Exercise 01 — Conditional type basics (solution)
 *
 * Each one reads as a sentence:
 * - "if T fits in string, true, else false"
 * - "if T is nullish, use the default, else keep T"
 * The branches can be any type at all — booleans, the inputs themselves, or
 * string literals.
 */
import { expectTypeOf, it } from "vitest";

type IsString<T> = T extends string ? true : false;

type Fallback<T, TDefault> = T extends null | undefined ? TDefault : T;

type Stringify<T> = T extends string ? "already-a-string" : "needs-conversion";

// --- tests ------------------------------------------------------------------

it("detects string types", () => {
  expectTypeOf<IsString<"hello">>().toEqualTypeOf<true>();
  expectTypeOf<IsString<string>>().toEqualTypeOf<true>();
  expectTypeOf<IsString<42>>().toEqualTypeOf<false>();
  expectTypeOf<IsString<string[]>>().toEqualTypeOf<false>();
});

it("substitutes a default for nullish types", () => {
  expectTypeOf<Fallback<string, "anonymous">>().toEqualTypeOf<string>();
  expectTypeOf<Fallback<number, 0>>().toEqualTypeOf<number>();
  expectTypeOf<Fallback<null, "anonymous">>().toEqualTypeOf<"anonymous">();
  expectTypeOf<Fallback<undefined, 0>>().toEqualTypeOf<0>();
});

it("labels types by whether they need conversion", () => {
  expectTypeOf<Stringify<"id">>().toEqualTypeOf<"already-a-string">();
  expectTypeOf<Stringify<number>>().toEqualTypeOf<"needs-conversion">();
  expectTypeOf<Stringify<Date>>().toEqualTypeOf<"needs-conversion">();
});
