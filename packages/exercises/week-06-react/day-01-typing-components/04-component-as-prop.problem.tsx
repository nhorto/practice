/**
 * Exercise 04 — Taking a component as a prop
 *
 * There's a difference between an ELEMENT (`<StarIcon size={16} />` — the
 * result of JSX, a value) and a COMPONENT (`StarIcon` — the function itself).
 * When the *parent* decides the props (here: the icon's size), it must
 * receive the component, typed `ComponentType<P>`, and create the element
 * itself.
 *
 * 🎯 `icon` is currently typed as an element (`ReactNode`). Retype it as a
 *    component taking `IconProps`, so `IconButton` can set the size.
 */
import type { ComponentType, ReactNode } from "react";
import { expect, expectTypeOf, it } from "vitest";

type IconProps = { size: number };

type IconButtonProps = {
  label: string;
  icon: ReactNode;
};

const IconButton = ({ label, icon: Icon }: IconButtonProps) => (
  <button type="button" className="icon-btn">
    <Icon size={16} />
    {label}
  </button>
);

// --- tests ------------------------------------------------------------------

const StarIcon = ({ size }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} />
);

it("creates the icon element itself, at its own size", () => {
  const element = IconButton({ label: "Favorite", icon: StarIcon });
  const [icon, label] = element.props.children;
  expect(icon.type).toBe(StarIcon);
  expect(icon.props.size).toBe(16);
  expect(label).toBe("Favorite");
});

it("takes the component, not an element", () => {
  expectTypeOf(IconButton)
    .parameter(0)
    .toHaveProperty("icon")
    .toEqualTypeOf<ComponentType<IconProps>>();
  <IconButton label="Save" icon={StarIcon} />;
  // @ts-expect-error this is an ELEMENT — pass the component itself
  <IconButton label="Save" icon={<StarIcon size={16} />} />;
});

it("rejects components with the wrong props", () => {
  const Chip = ({ text }: { text: string }) => <span className="chip">{text}</span>;
  // @ts-expect-error Chip's props are { text: string }, not IconProps
  <IconButton label="Save" icon={Chip} />;
});
