/**
 * Exercise 03 — Extending a native element (and masking a conflict) (solution)
 *
 * `Omit<ComponentPropsWithoutRef<"input">, "size">` removes the colliding
 * native prop before we extend, so our `"sm" | "lg"` version slots in
 * cleanly. Everything else — placeholder, required, onChange, ... — still
 * flows through.
 */
import type { ComponentPropsWithoutRef } from "react";
import { expect, expectTypeOf, it } from "vitest";

interface TextFieldProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  label: string;
  size?: "sm" | "lg";
}

const TextField = ({ label, size = "sm", ...rest }: TextFieldProps) => (
  <label className="field-label">
    {label}
    <input className={`field field-${size}`} {...rest} />
  </label>
);

// --- tests ------------------------------------------------------------------

it("renders a labelled input with native props forwarded", () => {
  const element = TextField({ label: "Email", placeholder: "you@example.com", required: true });
  const [text, input] = element.props.children;
  expect(text).toBe("Email");
  expect(input.type).toBe("input");
  expect(input.props.placeholder).toBe("you@example.com");
  expect(input.props.required).toBe(true);
  expect(input.props.className).toBe("field field-sm");
});

it("size now means OUR size", () => {
  const element = TextField({ label: "Bio", size: "lg" });
  const input = element.props.children[1];
  expect(input.props.className).toBe("field field-lg");
});

it("masks the native numeric size, keeps everything else", () => {
  expectTypeOf<TextFieldProps["size"]>().toEqualTypeOf<"sm" | "lg" | undefined>();
  <TextField label="Name" defaultValue="Ada" onChange={() => {}} />;
  // @ts-expect-error the native numeric size is masked out
  <TextField label="Name" size={4} />;
});
