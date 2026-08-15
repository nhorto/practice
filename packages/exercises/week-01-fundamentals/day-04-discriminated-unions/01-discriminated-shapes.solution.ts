/**
 * Exercise 01 — Discriminated shapes (solution)
 *
 * Each member carries a literal `kind` (the discriminant) and exactly its
 * own data. Checking `shape.kind === "circle"` now narrows the whole object,
 * so `radius` is a plain `number` inside the branch — no `?`, no `!`.
 */
import { expect, expectTypeOf, it } from "vitest";

export type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

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
