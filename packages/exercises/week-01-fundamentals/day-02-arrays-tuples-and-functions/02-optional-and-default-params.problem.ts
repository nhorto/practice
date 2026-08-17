/**
 * Exercise 02 — Optional and default parameters
 *
 * A parameter with `?` may be left out (its type gains `| undefined` inside
 * the function). A parameter with a default value (`separator = "-"`) may
 * ALSO be left out — but inside the function it's never undefined, because
 * the default kicks in.
 *
 * 🎯 The tests call both functions with the last argument missing, but the
 *    signatures demand it. Make `greeting` optional with `?` (the body
 *    already handles undefined), and give `separator` a default of "-".
 */
import { expect, expectTypeOf, it } from "vitest";

const greet = (name: string, greeting: string) => {
  return `${greeting ?? "Hello"}, ${name}!`;
};

const slugify = (text: string, separator: string) => {
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
