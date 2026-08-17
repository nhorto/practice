/**
 * Exercise 03 — children is ReactNode
 *
 * `children` is an ordinary prop — React only treats it specially in JSX
 * syntax. Type it `ReactNode` and it accepts everything React can render:
 * elements, strings, numbers, arrays of those, fragments, `null`...
 * Typing it narrower (like `string` here) rejects perfectly good JSX.
 *
 * 🎯 Fix `CardProps` so `Card` accepts any renderable children.
 */
import type { ReactNode } from "react";
import { expect, expectTypeOf, it } from "vitest";

type CardProps = {
  title: string;
  children: string;
};

const Card = ({ title, children }: CardProps) => (
  <section className="card">
    <h2>{title}</h2>
    <div className="card-body">{children}</div>
  </section>
);

// --- tests ------------------------------------------------------------------

it("wraps its children in a card body", () => {
  const element = Card({ title: "Note", children: "Remember to hydrate" });
  expect(element.type).toBe("section");
  const [heading, body] = element.props.children;
  expect(heading.type).toBe("h2");
  expect(heading.props.children).toBe("Note");
  expect(body.props.className).toBe("card-body");
  expect(body.props.children).toBe("Remember to hydrate");
});

it("accepts anything renderable, not just strings", () => {
  <Card title="One element">
    <p>a paragraph</p>
  </Card>;
  <Card title="Several">
    <p>first</p>
    <p>second</p>
  </Card>;
  <Card title="A number">{42}</Card>;
  <Card title="Nothing">{null}</Card>;
});

it("children is typed as ReactNode", () => {
  expectTypeOf(Card).parameter(0).toHaveProperty("children").toEqualTypeOf<ReactNode>();
});
