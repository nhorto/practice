/**
 * Exercise 01 — Props types (and why not React.FC) (solution)
 *
 * A plain function with an annotated props parameter. The return type is
 * inferred as `JSX.Element`, so callers keep the element type — something
 * `React.FC`'s `ReactNode | Promise<ReactNode>` return type throws away.
 */
import type { JSX } from "react";
import { expect, expectTypeOf, it } from "vitest";

type BadgeProps = {
  label: string;
  tone: "success" | "warning" | "error";
};

const Badge = (props: BadgeProps) => (
  <span className={`badge badge-${props.tone}`}>{props.label}</span>
);

// --- tests ------------------------------------------------------------------

it("is a plain annotated function, not React.FC", () => {
  expectTypeOf(Badge).toEqualTypeOf<(props: BadgeProps) => JSX.Element>();
});

it("creates a span with the tone class (no DOM needed)", () => {
  const element = Badge({ label: "New", tone: "success" });
  expect(element.type).toBe("span");
  expect(element.props.className).toBe("badge badge-success");
  expect(element.props.children).toBe("New");
});

it("rejects tones outside the union", () => {
  // @ts-expect-error "info" is not an allowed tone
  <Badge label="Beta" tone="info" />;
});
