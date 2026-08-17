/**
 * Exercise 01 — Props types (and why not React.FC)
 *
 * A React component is just a function. The modern way to type one is a plain
 * function with an annotated `props` parameter — the return type is inferred
 * as `JSX.Element`. The older `React.FC<P>` wrapper widens the return type to
 * `ReactNode | Promise<ReactNode>` (callers lose the element type, as the
 * failing tests below show) and it can't express generic components, which
 * you'll build later this week.
 *
 * 🎯 Rewrite `Badge` as a plain function that takes `BadgeProps` — no
 *    `React.FC`. Don't change the JSX it returns.
 */
import type { FC, JSX } from "react";
import { expect, expectTypeOf, it } from "vitest";

type BadgeProps = {
  label: string;
  tone: "success" | "warning" | "error";
};

const Badge: FC<BadgeProps> = (props) => (
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
