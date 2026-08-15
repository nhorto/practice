/**
 * Exercise 02 — Wrapping a native element: ComponentPropsWithoutRef
 *
 * A design-system Button should accept everything a real `<button>` accepts:
 * `type`, `disabled`, `onClick`, `aria-*`, `children`, ... Hand-listing them
 * (the current `ButtonProps`) never ends and is already three props behind.
 * `ComponentPropsWithoutRef<"button">` is the complete set — intersect it
 * with your own additions.
 *
 * 🎯 1. Retype `ButtonProps` as `ComponentPropsWithoutRef<"button">` plus
 *       `variant`.
 *    2. Merge the caller's `className` with the computed one instead of
 *       letting it clobber the `btn` classes.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { expect, expectTypeOf, it } from "vitest";

type ButtonProps = {
  variant: "primary" | "danger" | "ghost";
  children?: ReactNode;
  onClick?: () => void;
};

const Button = ({ variant, ...rest }: ButtonProps) => (
  <button className={`btn btn-${variant}`} {...rest} />
);

// --- tests ------------------------------------------------------------------

it("forwards native button props", () => {
  const element = Button({ variant: "primary", type: "submit", disabled: true, children: "Save" });
  expect(element.type).toBe("button");
  expect(element.props.type).toBe("submit");
  expect(element.props.disabled).toBe(true);
  expect(element.props.children).toBe("Save");
});

it("merges className instead of clobbering it", () => {
  const element = Button({ variant: "ghost", className: "wide", children: "Cancel" });
  expect(element.props.className).toBe("btn btn-ghost wide");
});

it("keeps variant off the DOM element", () => {
  const element = Button({ variant: "danger", children: "Delete" });
  expect(element.props.variant).toBeUndefined();
  expect(element.props.className).toBe("btn btn-danger");
});

it("accepts native props, rejects non-button ones", () => {
  <Button variant="primary" type="reset" aria-pressed="true" onClick={() => {}}>
    Go
  </Button>;
  expectTypeOf<ButtonProps["type"]>().toEqualTypeOf<"submit" | "reset" | "button" | undefined>();
  // @ts-expect-error buttons don't take href — that's an anchor thing
  <Button variant="primary" href="/somewhere">Go</Button>;
});
