/**
 * Exercise 01 — Conditional type basics
 *
 * `T extends X ? A : B` is an if/else that runs at the type level: "if T is
 * assignable to X, the type is A, otherwise B". It's how one generic type
 * can respond to what it's given.
 *
 * 🎯 Implement all three:
 *    - `IsString<T>` — `true` for string types, `false` for everything else
 *    - `Fallback<T, TDefault>` — `TDefault` when T is null or undefined,
 *      otherwise T itself
 *    - `Stringify<T>` — "already-a-string" for strings, "needs-conversion"
 *      for everything else
 */
import { expectTypeOf, it } from "vitest";

type IsString<T> = never; // TODO

type Fallback<T, TDefault> = never; // TODO

type Stringify<T> = never; // TODO

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
