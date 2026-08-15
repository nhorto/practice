/**
 * Exercise 02 — MyReturnType (solution)
 *
 * `T extends (...args: never[]) => infer R ? R : never`
 *
 * - The conditional MATCHES T against a function shape.
 * - `infer R` names whatever sits in the return position; the true branch
 *   hands it back.
 * - Because T appears "naked" to the left of `extends`, the conditional
 *   DISTRIBUTES over unions: MyReturnType<(() => "a") | (() => "b")> runs
 *   once per member and unions the results into "a" | "b".
 *
 * Why `never[]` for the params (and not `any[]`)? Parameters are checked
 * contravariantly: for `T extends (...args: never[]) => unknown` to hold,
 * T's parameters only need to ACCEPT members of never — which is vacuously
 * true for every function. It's the no-`any` way to say "any function".
 */
import { expect, expectTypeOf, it } from "vitest";

type MyReturnType<T extends (...args: never[]) => unknown> = T extends (
  ...args: never[]
) => infer R
  ? R
  : never;

// --- tests ------------------------------------------------------------------

it("extracts return types", () => {
  expectTypeOf<MyReturnType<() => string>>().toEqualTypeOf<string>();
  expectTypeOf<
    MyReturnType<(a: number, b: number) => boolean>
  >().toEqualTypeOf<boolean>();
});

it("works on inferred function types, including async", () => {
  const fetchUser = async (id: string) => ({ id, name: "Ada" });
  expectTypeOf<MyReturnType<typeof fetchUser>>().toEqualTypeOf<
    Promise<{ id: string; name: string }>
  >();
  expect(typeof fetchUser).toBe("function");
});

it("distributes over unions of functions", () => {
  type Either = (() => "a") | (() => "b");
  expectTypeOf<MyReturnType<Either>>().toEqualTypeOf<"a" | "b">();
});

it("only accepts function types", () => {
  // @ts-expect-error a string is not a function type
  type Bad = MyReturnType<string>;
  expect(true).toBe(true);
});
