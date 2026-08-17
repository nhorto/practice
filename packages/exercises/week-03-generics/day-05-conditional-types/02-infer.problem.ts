/**
 * Exercise 02 — infer
 *
 * `infer` captures part of the matched type so the true branch can use it:
 * `T extends (infer E)[] ? E : never` — "if T is an array of SOMETHING,
 * give me the something". This is how `ReturnType`, `Awaited`, and
 * `Parameters` work under the hood.
 *
 * 🎯 Implement all three:
 *    - `ElementOf<T>` — the element type of an array, `never` otherwise
 *    - `UnwrapPromise<T>` — what a Promise resolves to; non-Promises pass
 *      through unchanged
 *    - `ReturnOf<F>` — what a function returns, `never` for non-functions.
 *      (Match "any function" with `(...args: never[]) => infer R` — not
 *      `any`, which we never use.)
 */
import { expectTypeOf, it } from "vitest";

type ElementOf<T> = never; // TODO

type UnwrapPromise<T> = never; // TODO

type ReturnOf<F> = never; // TODO

// --- tests ------------------------------------------------------------------

it("extracts the element type of an array", () => {
  expectTypeOf<ElementOf<string[]>>().toEqualTypeOf<string>();
  expectTypeOf<ElementOf<{ id: number }[]>>().toEqualTypeOf<{ id: number }>();
  expectTypeOf<ElementOf<number>>().toEqualTypeOf<never>();
});

it("unwraps promises and passes everything else through", () => {
  expectTypeOf<UnwrapPromise<Promise<number>>>().toEqualTypeOf<number>();
  expectTypeOf<UnwrapPromise<Promise<string[]>>>().toEqualTypeOf<string[]>();
  expectTypeOf<UnwrapPromise<string>>().toEqualTypeOf<string>();
});

it("extracts what a function returns", () => {
  expectTypeOf<ReturnOf<() => Date>>().toEqualTypeOf<Date>();
  expectTypeOf<ReturnOf<(id: string) => number>>().toEqualTypeOf<number>();
  expectTypeOf<ReturnOf<string>>().toEqualTypeOf<never>();
});
