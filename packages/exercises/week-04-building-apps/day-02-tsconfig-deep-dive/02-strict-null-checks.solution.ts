/**
 * Exercise 02 — What `strictNullChecks` catches (solution)
 *
 * `?.` reaches into possibly-missing values, `??` supplies the fallback.
 * Note how each fix also *documents* the empty case — the guest greeting,
 * the "unbound" shortcut — instead of crashing on it.
 */
import { expect, expectTypeOf, it } from "vitest";

type Session = { user: { name: string } | null };

const greeting = (session: Session): string =>
  `Welcome back, ${session.user?.name ?? "guest"}`;

const shortcuts = new Map<string, string>([
  ["save", "Ctrl+S"],
  ["find", "Ctrl+F"],
]);

const shortcutFor = (action: string): string =>
  (shortcuts.get(action) ?? "unbound").toUpperCase();

type Member = { id: number; email: string };

const emailOf = (members: Member[], id: number): string | undefined =>
  members.find((member) => member.id === id)?.email;

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
