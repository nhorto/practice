/**
 * Exercise 04 — DeepReadonly and Prettify (solution)
 *
 * DeepReadonly, case by case:
 * 1. `T extends (...args: never[]) => unknown ? T` — functions ARE objects,
 *    so without this branch first, a function type would fall into the mapped
 *    type and be reduced to `{}` (functions have no enumerable keys). Order
 *    of conditional branches matters.
 * 2. `T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> }` —
 *    the homomorphic mapped type adds `readonly` and RECURSES per property.
 *    Arrays take this branch too: mapping over an array type keeps its
 *    array-ness, so `string[]` becomes `readonly string[]`.
 * 3. `: T` — primitives (and everything else) pass through, ending recursion.
 *
 * Prettify — `{ [K in keyof T]: T[K] } & {}` — looks like a no-op, and
 * assignability-wise it is. Its job is IDENTITY: forcing TypeScript to
 * evaluate an intersection into one flat object type. The `& {}` nudges the
 * compiler to eagerly resolve the mapped type instead of displaying it
 * unevaluated. You met this in day 2's builder; now you've built it.
 */
import { expect, expectTypeOf, it } from "vitest";

type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

// --- tests ------------------------------------------------------------------

type AgentConfig = {
  model: string;
  limits: { maxTokens: number; stopSequences: string[] };
};

it("freezes every level, including arrays", () => {
  expectTypeOf<DeepReadonly<AgentConfig>>().toEqualTypeOf<{
    readonly model: string;
    readonly limits: {
      readonly maxTokens: number;
      readonly stopSequences: readonly string[];
    };
  }>();
});

it("leaves primitives and functions untouched", () => {
  expectTypeOf<DeepReadonly<number>>().toEqualTypeOf<number>();
  expectTypeOf<DeepReadonly<{ fn: () => void }>>().toEqualTypeOf<{
    readonly fn: () => void;
  }>();
});

it("blocks mutation at every depth", () => {
  const tryMutate = (config: DeepReadonly<AgentConfig>) => {
    // @ts-expect-error top-level properties are readonly
    config.model = "other";
    // @ts-expect-error nested properties are readonly too
    config.limits.maxTokens = 2000;
  };
  expect(typeof tryMutate).toBe("function");
});

it("flattens intersections into one readable object", () => {
  type WithTimestamps = { id: string } & { createdAt: number } & {
    updatedAt: number;
  };
  expectTypeOf<Prettify<WithTimestamps>>().toEqualTypeOf<{
    id: string;
    createdAt: number;
    updatedAt: number;
  }>();
  // The raw intersection is assignable both ways but NOT the same identity —
  // that's exactly what Prettify fixes.
  expectTypeOf<WithTimestamps>().not.toEqualTypeOf<{
    id: string;
    createdAt: number;
    updatedAt: number;
  }>();
});
