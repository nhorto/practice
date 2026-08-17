/**
 * Exercise 04 — DeepReadonly and Prettify
 * (type-challenges #9 "Deep Readonly", plus everyone's favorite one-liner)
 *
 * `DeepReadonly` is a RECURSIVE conditional type: primitives pass through,
 * functions pass through untouched, and objects/arrays get every property
 * marked `readonly` — then recurse into the property's type.
 *
 * `Prettify` flattens an intersection like `{ a } & { b }` into a single
 * object type `{ a; b }`. Same assignability — but a different (and far more
 * readable) type identity, which tooling and strict type tests care about.
 *
 * 🎯 Implement both. The placeholders return T untouched. For DeepReadonly,
 *    handle three cases in order: functions, objects, everything else.
 */
import { expect, expectTypeOf, it } from "vitest";

type DeepReadonly<T> = T;

type Prettify<T> = T;

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
