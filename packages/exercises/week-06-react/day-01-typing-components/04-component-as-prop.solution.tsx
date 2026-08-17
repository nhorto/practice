/**
 * Exercise 04 — Taking a component as a prop (solution)
 *
 * `icon: ComponentType<IconProps>` says "give me a component I can call with
 * IconProps". IconButton then creates the element itself — `<Icon size={16} />`
 * — which is exactly why it must receive the function, not a ready-made
 * element whose props are already locked in.
 */
import type { ComponentType } from "react";
import { expect, expectTypeOf, it } from "vitest";

type IconProps = { size: number };

type IconButtonProps = {
  label: string;
  icon: ComponentType<IconProps>;
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
