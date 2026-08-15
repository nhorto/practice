/**
 * Exercise 04 — ComponentProps<typeof SomeComponent>
 *
 * Some components don't export their props type. You don't need them to:
 * `ComponentProps<typeof AreaChart>` extracts it from the component itself.
 * Derived types stay correct when the source changes — the hand-copied guess
 * below is already wrong (it dropped `smooth` and got `data` mutable).
 *
 * 🎯 Derive `SparkLineProps` from `AreaChart` with `ComponentProps`, minus
 *    the `width`/`height` that SparkLine fixes itself.
 */
import type { ComponentProps } from "react";
import { expect, expectTypeOf, it } from "vitest";

// Imagine this ships from a chart library that exports ONLY the component.
const AreaChart = (props: {
  data: readonly number[];
  width: number;
  height: number;
  smooth?: boolean;
}) => (
  <svg viewBox={`0 0 ${props.width} ${props.height}`} width={props.width} height={props.height}>
    <title>{props.data.join(", ")}</title>
  </svg>
);

type SparkLineProps = { data: number[] };

const SparkLine = (props: SparkLineProps) => <AreaChart width={120} height={24} {...props} />;

// --- tests ------------------------------------------------------------------

it("fixes the size and forwards everything else", () => {
  const element = SparkLine({ data: [1, 5, 3], smooth: true });
  expect(element.type).toBe(AreaChart);
  expect(element.props).toEqual({ width: 120, height: 24, data: [1, 5, 3], smooth: true });
});

it("derives its props from AreaChart", () => {
  expectTypeOf<SparkLineProps>().toEqualTypeOf<{ data: readonly number[]; smooth?: boolean }>();
  <SparkLine data={[2, 4]} />;
  <SparkLine data={[2, 4]} smooth />;
  // @ts-expect-error width is SparkLine's own business
  <SparkLine data={[2, 4]} width={999} />;
});
