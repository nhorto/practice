/**
 * Exercise 02 — MyReturnType
 * (type-challenges #2 "Get Return Type", rebuilt from scratch)
 *
 * `infer` lets a conditional type DESTRUCTURE a type: match the shape, name a
 * piece of it, use the piece. Here the piece is a function's return type.
 *
 * Note the constraint uses `(...args: never[]) => unknown` — the "accepts any
 * function" shape that needs no `any`: parameter types are contravariant, so
 * `never[]` params match every function, and every return is `unknown`-able.
 *
 * 🎯 Implement `MyReturnType` with a conditional type + `infer` — without
 *    using the built-in `ReturnType`.
 */
import { expect, expectTypeOf, it } from "vitest";

type MyReturnType<T extends (...args: never[]) => unknown> = unknown;

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
