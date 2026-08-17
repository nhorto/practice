/**
 * Exercise 03 — `ReturnType`, `Parameters`, and `Awaited`
 *
 * Functions are type sources too. `ReturnType<typeof fn>` is what a call
 * returns, `Parameters<typeof fn>` is its argument tuple, and
 * `Awaited<ReturnType<typeof asyncFn>>` unwraps the promise an async
 * function returns. The hand-written versions below drifted in all three
 * ways: a missing field, a missing parameter, and a type still wrapped in
 * `Promise`.
 *
 * 🎯 Derive all three:
 *    1. `Session`          from `createSession`'s return type
 *    2. `CreateSessionArgs` from `createSession`'s parameters
 *    3. `FetchedSession`   from `fetchSession` — awaited, not the promise!
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

// Hand-written — drifted (token is missing).
type Session = { userId: string; expiresAt: number };

// Hand-written — drifted (ttlSeconds is missing).
type CreateSessionArgs = [userId: string];

// Hand-written — still wrapped in Promise. `await` already unwrapped it!
type FetchedSession = Promise<{ userId: string; valid: boolean }>;

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
