/**
 * Exercise 02 — infer (solution)
 *
 * Each pattern names the part it wants and returns it from the true branch.
 * Note the two different false branches: `ElementOf` and `ReturnOf` give up
 * with `never`, while `UnwrapPromise` passes non-Promises through — both are
 * legitimate designs, chosen per use case.
 */
import { expectTypeOf, it } from "vitest";

type ElementOf<T> = T extends (infer E)[] ? E : never;

type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;

type ReturnOf<F> = F extends (...args: never[]) => infer R ? R : never;

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
