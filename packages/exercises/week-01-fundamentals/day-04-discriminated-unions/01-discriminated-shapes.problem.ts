/**
 * Exercise 01 — Discriminated shapes
 *
 * This `Shape` is a "bag of optionals": every property might be there,
 * so TypeScript can't prove `radius` exists even after you've checked
 * `kind === "circle"` — because `kind: string` doesn't tell it anything.
 *
 * A discriminated union fixes both problems at once: each member carries a
 * LITERAL `kind` plus exactly the properties that member really has.
 *
 * 🎯 Rewrite `Shape` as a union of two members:
 *      { kind: "circle"; radius: number }
 *      { kind: "rectangle"; width: number; height: number }
 *    The bodies then compile as-is — checking `kind` narrows to one member.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Shape = {
  kind: string;
  radius?: number;
  width?: number;
  height?: number;
};

const area = (shape: Shape): number => {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
  return shape.width * shape.height;
};

const describe = (shape: Shape): string => {
  return shape.kind === "circle"
    ? `circle (r=${shape.radius})`
    : `${shape.width}x${shape.height} rectangle`;
};

// --- tests ------------------------------------------------------------------

it("computes areas", () => {
  expect(area({ kind: "circle", radius: 2 })).toBeCloseTo(12.566, 3);
  expect(area({ kind: "rectangle", width: 3, height: 4 })).toBe(12);
});

it("describes shapes", () => {
  expect(describe({ kind: "circle", radius: 2 })).toBe("circle (r=2)");
  expect(describe({ kind: "rectangle", width: 3, height: 4 })).toBe(
    "3x4 rectangle",
  );
});

it("has the correct types", () => {
  expectTypeOf<Shape>().toEqualTypeOf<
    | { kind: "circle"; radius: number }
    | { kind: "rectangle"; width: number; height: number }
  >();

  // Each member has exactly its own properties — no mixing:
  // @ts-expect-error — a circle has no width
  const impossible: Shape = { kind: "circle", radius: 1, width: 2 };
  expect(impossible).toBeDefined();
});
