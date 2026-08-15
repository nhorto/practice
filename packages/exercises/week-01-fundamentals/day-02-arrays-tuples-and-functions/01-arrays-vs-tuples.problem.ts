/**
 * Exercise 01 — Arrays vs tuples
 *
 * `number[]` means "any amount of numbers". A tuple like `[number, number]`
 * means "exactly two numbers, in this order". Because a plain array doesn't
 * know its length, destructuring one gives you `number | undefined` — which
 * is why the math below doesn't type-check.
 *
 * 🎯 1. Change `Coordinate` into a two-element tuple.
 *    2. Give `minMax` a tuple return type: `[min: number, max: number]`.
 *    Don't change any function bodies.
 */
import { expect, expectTypeOf, it } from "vitest";

type Coordinate = number[];

const distanceFromOrigin = (point: Coordinate) => {
  const [x, y] = point;
  return Math.sqrt(x * x + y * y);
};

const minMax = (values: number[]): number[] => {
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
