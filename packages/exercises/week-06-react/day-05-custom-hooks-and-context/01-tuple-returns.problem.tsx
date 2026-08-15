/**
 * Exercise 01 — Custom hook signatures: tuple returns
 *
 * Return `[value, toggle]` from a custom hook and TypeScript infers
 * `(boolean | (() => void))[]` — an ordinary array where EVERY slot might be
 * either thing. Destructurers get useless types (watch `onClick={toggle}`
 * fail below). `as const` turns the return into a readonly TUPLE: position 0
 * is the boolean, position 1 is the function — exactly how `useState`'s own
 * return type works.
 *
 * 🎯 Fix `useToggle`'s return so consumers get a proper tuple.
 */
import type { ReactNode } from "react";
import { useState } from "react";
import { expect, expectTypeOf, it } from "vitest";

const useToggle = (initial: boolean) => {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((current) => !current);
  return [on, toggle];
};

const DisclosurePanel = ({ summary, children }: { summary: string; children: ReactNode }) => {
  const [open, toggle] = useToggle(false);
  return (
    <section className="disclosure">
      <button onClick={toggle}>{summary}</button>
      {open ? <div className="panel-body">{children}</div> : null}
    </section>
  );
};

// --- tests ------------------------------------------------------------------

it("returns a readonly [boolean, () => void] tuple", () => {
  expectTypeOf(useToggle).returns.toEqualTypeOf<readonly [boolean, () => void]>();
  expectTypeOf(useToggle).parameter(0).toEqualTypeOf<boolean>();
});

it("the consumer destructures without fighting the types", () => {
  const element = <DisclosurePanel summary="Details">More info</DisclosurePanel>;
  expect(element.type).toBe(DisclosurePanel);
  expect(element.props.summary).toBe("Details");
  expect(element.props.children).toBe("More info");
});
