/**
 * Exercise 03 — Validating a fetch response
 *
 * The network is the other big boundary. `response.json()` is typed `any` —
 * one `as User` cast and a misshapen payload walks straight into your app
 * wearing a trusted type. The fix is the same as ever: treat the payload as
 * `unknown` and parse it at the edge.
 *
 * `fetchJson` below stands in for the real network — a plain async function
 * returning unknown JSON. Don't modify it.
 *
 * 🎯 Two functions to fix:
 *      - `getUser`: replace the `as` cast with `UserSchema.parse`, so a bad
 *        payload REJECTS instead of leaking through.
 *      - `getUserSafe`: same boundary, but return `null` on any invalid
 *        payload instead of throwing (use safeParse).
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
  // TODO: this cast trusts the network. Parse instead.
  return payload as User;
};

const getUserSafe = async (id: number): Promise<User | null> => {
  const payload = await fetchJson(`/api/users/${id}`);
  // TODO: safeParse; return the data on success, null otherwise.
  return payload as User;
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
