/**
 * Exercise 02 — Wrapping a native element: ComponentPropsWithoutRef (solution)
 *
 * `ComponentPropsWithoutRef<"button"> & { variant: ... }` gives Button the
 * full native surface plus our addition. The body peels `variant` and
 * `className` off, merges the class names, and spreads the rest straight
 * onto the element — future native props flow through with zero edits.
 */
import type { ComponentPropsWithoutRef } from "react";
import { expect, expectTypeOf, it } from "vitest";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant: "primary" | "danger" | "ghost";
};

const Button = ({ variant, className, ...rest }: ButtonProps) => (
  <button
    className={["btn", `btn-${variant}`, className].filter(Boolean).join(" ")}
    {...rest}
  />
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
