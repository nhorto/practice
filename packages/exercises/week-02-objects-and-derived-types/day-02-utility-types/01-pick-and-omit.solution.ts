/**
 * Exercise 01 — `Pick` and `Omit` (solution)
 *
 * Both types are now derived from `User`, so they can never drift: rename a
 * field on `User` and both update automatically.
 */
import { expect, expectTypeOf, it } from "vitest";

type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
};

type PublicUser = Omit<User, "passwordHash">;

type UserCredentials = Pick<User, "id" | "passwordHash">;

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
