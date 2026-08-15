/**
 * Exercise 01 — Custom hook signatures: tuple returns (solution)
 *
 * One `as const` and the return type becomes `readonly [boolean, () => void]`:
 * position 0 is always the value, position 1 is always the function.
 * Consumers destructure exactly like `useState`. (For hooks returning three
 * or more things, a named object is usually kinder than a tuple.)
 */
import type { ReactNode } from "react";
import { useState } from "react";
import { expect, expectTypeOf, it } from "vitest";

const useToggle = (initial: boolean) => {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((current) => !current);
  return [on, toggle] as const;
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
