/**
 * Exercise 03 — Validating a fetch response (solution)
 *
 * The schema sits exactly at the await: everything before it is `unknown`,
 * everything after it is a proven `User`. Choose `.parse` when a bad payload
 * is exceptional, `.safeParse` when the caller wants to handle it inline.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// --- the mock network (don't modify) ---
const responses: Record<string, unknown> = {
  "/api/users/1": { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  "/api/users/2": { id: "2", name: "Broken Payload" },
};

const fetchJson = async (url: string): Promise<unknown> => {
  return responses[url] ?? { error: "not found" };
};
// ---------------------------------------

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
});

type User = z.infer<typeof UserSchema>;

const getUser = async (id: number): Promise<User> => {
  const payload = await fetchJson(`/api/users/${id}`);
  return UserSchema.parse(payload);
};

const getUserSafe = async (id: number): Promise<User | null> => {
  const payload = await fetchJson(`/api/users/${id}`);
  const result = UserSchema.safeParse(payload);
  return result.success ? result.data : null;
};

// --- tests ------------------------------------------------------------------

it("returns a parsed user for a good payload", async () => {
  const user = await getUser(1);
  expect(user).toEqual({ id: 1, name: "Ada Lovelace", email: "ada@example.com" });
  expectTypeOf(user).toEqualTypeOf<User>();
});

it("rejects when the payload doesn't match the schema", async () => {
  // id arrives as a string and email is missing — the cast would let it through.
  await expect(getUser(2)).rejects.toThrow();
  await expect(getUser(404)).rejects.toThrow();
});

it("getUserSafe returns null instead of throwing", async () => {
  expect(await getUserSafe(1)).toEqual({
    id: 1,
    name: "Ada Lovelace",
    email: "ada@example.com",
  });
  expect(await getUserSafe(2)).toBeNull();
  expect(await getUserSafe(404)).toBeNull();
});
