/**
 * Exercise 02 — Optional and default parameters (solution)
 *
 * `greeting?: string` — the caller may omit it; inside, it's
 * `string | undefined`, so the body's `??` fallback matters.
 * `separator = "-"` — the caller may omit it; inside, it's always `string`.
 * Both produce the same call signature: the parameter becomes optional.
 */
import { expect, expectTypeOf, it } from "vitest";

const greet = (name: string, greeting?: string) => {
  return `${greeting ?? "Hello"}, ${name}!`;
};

const slugify = (text: string, separator = "-") => {
  return text.toLowerCase().split(/\s+/).join(separator);
};

// --- tests ------------------------------------------------------------------

it("greets with and without an explicit greeting", () => {
  expect(greet("Ada", "Good morning")).toBe("Good morning, Ada!");
  expect(greet("Ada")).toBe("Hello, Ada!");
});

it("slugifies with the default and a custom separator", () => {
  expect(slugify("Total TypeScript Rocks")).toBe("total-typescript-rocks");
  expect(slugify("Total TypeScript Rocks", "_")).toBe("total_typescript_rocks");
});

it("has the correct types", () => {
  expectTypeOf(greet).toEqualTypeOf<(name: string, greeting?: string) => string>();
  // A default value makes the parameter optional from the caller's side too:
  expectTypeOf(slugify).toEqualTypeOf<
    (text: string, separator?: string) => string
  >();
});
