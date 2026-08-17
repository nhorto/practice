/**
 * Exercise 01 — `Pick` and `Omit`
 *
 * A type that is "User minus the secret bits" or "just these two fields of
 * User" should be DERIVED from `User`, not copied. Copies drift — and the
 * ones below already have: one field changed its type, another its name.
 *
 * 🎯 1. Rewrite `PublicUser` as `Omit<User, ...>` (everything but the
 *       password hash).
 *    2. Rewrite `UserCredentials` as `Pick<User, ...>` (just `id` and
 *       `passwordHash`).
 *    Don't touch `User` or the function bodies — deriving fixes the drift.
 */
import { expect, expectTypeOf, it } from "vitest";

type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
};

// Hand-copied from User… and already out of date.
type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

// Also hand-copied… also wrong.
type UserCredentials = {
  id: string;
  password: string;
};

const toPublicUser = (user: User): PublicUser => {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
};

// --- tests ------------------------------------------------------------------

it("derives both types from User", () => {
  expectTypeOf<PublicUser>().toEqualTypeOf<Omit<User, "passwordHash">>();
  expectTypeOf<UserCredentials>().toEqualTypeOf<
    Pick<User, "id" | "passwordHash">
  >();
});

it("strips the password hash", () => {
  const user: User = {
    id: "u1",
    name: "Ada",
    email: "ada@example.com",
    passwordHash: "$2b$10$abc",
    createdAt: 1700000000,
  };
  expect(toPublicUser(user)).toEqual({
    id: "u1",
    name: "Ada",
    email: "ada@example.com",
    createdAt: 1700000000,
  });
});

it("keeps credentials in sync with User's field names", () => {
  const credentials: UserCredentials = {
    id: "u1",
    passwordHash: "$2b$10$abc",
  };
  expect(credentials.passwordHash.startsWith("$2b$")).toBe(true);
});
