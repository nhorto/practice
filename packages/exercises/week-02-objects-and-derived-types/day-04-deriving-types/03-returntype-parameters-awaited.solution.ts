/**
 * Exercise 03 — `ReturnType`, `Parameters`, and `Awaited` (solution)
 *
 * All three types are derived from the functions themselves. Change
 * `createSession`'s signature and `Session`/`CreateSessionArgs` follow;
 * `Awaited<...>` unwraps the async function's promise.
 */
import { expect, expectTypeOf, it } from "vitest";

const createSession = (userId: string, ttlSeconds: number) => {
  return {
    userId,
    expiresAt: 1_700_000_000_000 + ttlSeconds * 1000,
    token: `tok_${userId}`,
  };
};

const fetchSession = async (token: string) => {
  return { userId: "u1", valid: token.startsWith("tok_") };
};

type Session = ReturnType<typeof createSession>;

type CreateSessionArgs = Parameters<typeof createSession>;

type FetchedSession = Awaited<ReturnType<typeof fetchSession>>;

// --- tests ------------------------------------------------------------------

it("derives all three types from the functions", () => {
  expectTypeOf<Session>().toEqualTypeOf<ReturnType<typeof createSession>>();
  expectTypeOf<CreateSessionArgs>().toEqualTypeOf<
    Parameters<typeof createSession>
  >();
  expectTypeOf<FetchedSession>().toEqualTypeOf<
    Awaited<ReturnType<typeof fetchSession>>
  >();
});

it("replays a call from captured arguments", () => {
  const args: CreateSessionArgs = ["u1", 60];
  const session: Session = createSession(...args);
  expect(session.token).toBe("tok_u1");
  expect(session.expiresAt).toBe(1_700_000_060_000);
});

it("holds the awaited value, not the promise", async () => {
  const fetched: FetchedSession = await fetchSession("tok_u1");
  expect(fetched.valid).toBe(true);
});
