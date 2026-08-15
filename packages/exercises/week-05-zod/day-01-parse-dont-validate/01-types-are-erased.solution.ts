/**
 * Exercise 01 — Types are erased (solution)
 *
 * The schema is the runtime check the type system can't give you, and
 * `z.infer` keeps the static type derived from it — one source of truth.
 * Note zod v4's top-level `z.email()`, not a `.email()` method on strings.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
});

type User = z.infer<typeof UserSchema>;

const loadUser = (json: string): User => {
  return UserSchema.parse(JSON.parse(json));
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
