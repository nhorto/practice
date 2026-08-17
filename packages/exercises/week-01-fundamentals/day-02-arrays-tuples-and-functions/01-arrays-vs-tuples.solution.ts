/**
 * Exercise 01 — Arrays vs tuples (solution)
 *
 * A tuple knows its length AND the type at each position, so destructuring
 * gives plain `number`s — no `| undefined` in sight. The labels in
 * `[min: number, max: number]` are pure documentation for readers and IDEs.
 */
import { expect, expectTypeOf, it } from "vitest";

type Coordinate = [number, number];

const distanceFromOrigin = (point: Coordinate) => {
  const [x, y] = point;
  return Math.sqrt(x * x + y * y);
};

const minMax = (values: number[]): [min: number, max: number] => {
  return [Math.min(...values), Math.max(...values)];
};

// --- tests ------------------------------------------------------------------

it("measures the distance from the origin", () => {
  expect(distanceFromOrigin([3, 4])).toBe(5);
});

it("returns min and max as a pair", () => {
  const [min, max] = minMax([3, 1, 4, 1, 5]);
  expect(min).toBe(1);
  expect(max).toBe(5);
});

it("has the correct types", () => {
  expectTypeOf<Coordinate>().toEqualTypeOf<[number, number]>();
  expectTypeOf(minMax).returns.toEqualTypeOf<[min: number, max: number]>();

  // A tuple rejects the wrong number of elements — an array wouldn't.
  // @ts-expect-error — three elements is not a Coordinate
  const tooMany: Coordinate = [1, 2, 3];
  expect(tooMany).toHaveLength(3);
});
