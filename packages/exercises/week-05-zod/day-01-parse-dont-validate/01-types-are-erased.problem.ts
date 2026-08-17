/**
 * Exercise 01 — Types are erased
 *
 * TypeScript types vanish when your code compiles. `JSON.parse(json) as User`
 * is a promise the compiler takes on faith and the runtime never checks: a
 * payload with `id: "oops"` sails straight through. Runtime validation exists
 * because the type system stops at the compile boundary — a Zod schema is the
 * runtime check, and `z.infer` derives the static type from it.
 *
 * 🎯 Describe the user shape in `UserSchema` (id: number, name: string,
 *    email: a valid email — use top-level `z.email()`), then make `loadUser`
 *    actually check the data with `UserSchema.parse` instead of the cast.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: add the fields — the empty object shape checks nothing.
const UserSchema = z.object({});

type User = z.infer<typeof UserSchema>;

const loadUser = (json: string): User => {
  // TODO: this cast is a lie — nothing checks the parsed value at runtime.
  return JSON.parse(json) as User;
};

// --- tests ------------------------------------------------------------------

it("loads a valid user", () => {
  const user = loadUser('{"id":1,"name":"Ada","email":"ada@example.com"}');
  expect(user).toEqual({ id: 1, name: "Ada", email: "ada@example.com" });
});

it("throws on data that doesn't match the schema", () => {
  // id is a string here — a cast would let it through; a parse must not.
  expect(() =>
    loadUser('{"id":"oops","name":"Ada","email":"ada@example.com"}'),
  ).toThrow();
  expect(() => loadUser('{"id":2,"name":"Eve","email":"not-an-email"}')).toThrow();
});

it("derives the User type from the schema", () => {
  expectTypeOf<User>().toEqualTypeOf<{
    id: number;
    name: string;
    email: string;
  }>();
  expectTypeOf(loadUser).returns.toEqualTypeOf<User>();
});
