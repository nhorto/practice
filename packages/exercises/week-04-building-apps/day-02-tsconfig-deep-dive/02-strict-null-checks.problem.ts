/**
 * Exercise 02 — What `strictNullChecks` catches
 *
 * Without `strictNullChecks`, `null` and `undefined` are assignable to
 * everything — "the billion-dollar mistake" baked into the type system. With
 * it on (part of `strict`), APIs that can come up empty — a nullable field,
 * `Map.get`, `Array.find` — force you to handle the empty case *before* you
 * touch the value.
 *
 * 🎯 The bodies below were written as if `strictNullChecks` were off. Fix
 *    each one to handle the missing case (see the tests for the expected
 *    fallback behavior). Reach for `?.` and `??` before writing an `if`.
 */
import { expect, expectTypeOf, it } from "vitest";

type Session = { user: { name: string } | null };

const greeting = (session: Session): string =>
  `Welcome back, ${session.user.name}`;

const shortcuts = new Map<string, string>([
  ["save", "Ctrl+S"],
  ["find", "Ctrl+F"],
]);

const shortcutFor = (action: string): string =>
  shortcuts.get(action).toUpperCase();

type Member = { id: number; email: string };

const emailOf = (members: Member[], id: number): string | undefined =>
  members.find((member) => member.id === id).email;

// --- tests ------------------------------------------------------------------

it("greets a signed-in user and a guest", () => {
  expect(greeting({ user: { name: "Ada" } })).toBe("Welcome back, Ada");
  expect(greeting({ user: null })).toBe("Welcome back, guest");
});

it("upper-cases known shortcuts and falls back for unbound ones", () => {
  expect(shortcutFor("save")).toBe("CTRL+S");
  expect(shortcutFor("jump")).toBe("UNBOUND");
});

it("finds an email only if the member exists", () => {
  const members = [{ id: 1, email: "ada@example.com" }];
  expect(emailOf(members, 1)).toBe("ada@example.com");
  expect(emailOf(members, 2)).toBeUndefined();
});

it("has the correct types", () => {
  expectTypeOf(greeting).toEqualTypeOf<(session: Session) => string>();
  expectTypeOf(shortcutFor).toEqualTypeOf<(action: string) => string>();
  expectTypeOf(emailOf).returns.toEqualTypeOf<string | undefined>();
});
