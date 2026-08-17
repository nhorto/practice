/**
 * Exercise 02 — Optional props with defaults (solution)
 *
 * `?` in the props type makes the prop optional for callers; the `=` in the
 * destructuring pattern resolves it inside the body. Note the two live in
 * different places — the type never mentions the default value.
 */
import { expect, expectTypeOf, it } from "vitest";

type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
};

const Avatar = ({ name, size = "md", rounded = true }: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((word) => word.slice(0, 1))
    .join("")
    .toUpperCase();
  return (
    <div className={`avatar avatar-${size}${rounded ? " avatar-round" : ""}`} title={name}>
      {initials}
    </div>
  );
};

// --- tests ------------------------------------------------------------------

it("falls back to the defaults", () => {
  const element = Avatar({ name: "Ada Lovelace" });
  expect(element.props.className).toBe("avatar avatar-md avatar-round");
  expect(element.props.children).toBe("AL");
});

it("accepts explicit values", () => {
  const element = Avatar({ name: "Grace Hopper", size: "lg", rounded: false });
  expect(element.props.className).toBe("avatar avatar-lg");
  expect(element.props.title).toBe("Grace Hopper");
});

it("size and rounded are optional", () => {
  <Avatar name="Alan Turing" />;
  expectTypeOf(Avatar).parameter(0).toEqualTypeOf<{
    name: string;
    size?: "sm" | "md" | "lg";
    rounded?: boolean;
  }>();
});
