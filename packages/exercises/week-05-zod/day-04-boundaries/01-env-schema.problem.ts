/**
 * Exercise 01 — An env schema
 *
 * `process.env` is typed `Record<string, string | undefined>` — every value
 * a maybe-string, no matter what your app actually needs. A schema turns
 * that soup into typed config at startup: enums for modes, coercion for
 * numbers, defaults for optional knobs, and a crash (with a good message)
 * for anything missing.
 *
 * 🎯 Build `EnvSchema` for this app:
 *      - NODE_ENV:     "development" | "test" | "production"
 *      - PORT:         coerced int 1..65535, default 3000
 *      - DATABASE_URL: a valid URL (z.url()) — required, no default
 *      - LOG_LEVEL:    "debug" | "info" | "warn" | "error", default "info"
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

// TODO: replace the placeholder — model the four variables above.
const EnvSchema = z.object({});

type Env = z.output<typeof EnvSchema>;

// --- tests ------------------------------------------------------------------

// process.env-shaped fixtures — everything is a string (or missing):
const fullEnv = {
  NODE_ENV: "production",
  PORT: "8080",
  DATABASE_URL: "postgres://db.internal:5432/app",
  LOG_LEVEL: "warn",
};

const minimalEnv = {
  NODE_ENV: "development",
  DATABASE_URL: "postgres://localhost:5432/app",
};

it("parses a fully specified environment", () => {
  expect(EnvSchema.parse(fullEnv)).toEqual({
    NODE_ENV: "production",
    PORT: 8080,
    DATABASE_URL: "postgres://db.internal:5432/app",
    LOG_LEVEL: "warn",
  });
});

it("fills defaults for optional knobs", () => {
  expect(EnvSchema.parse(minimalEnv)).toEqual({
    NODE_ENV: "development",
    PORT: 3000,
    DATABASE_URL: "postgres://localhost:5432/app",
    LOG_LEVEL: "info",
  });
});

it("rejects missing or malformed variables", () => {
  expect(EnvSchema.safeParse({ NODE_ENV: "development" }).success).toBe(false);
  expect(
    EnvSchema.safeParse({ ...minimalEnv, NODE_ENV: "prod" }).success,
  ).toBe(false);
  expect(EnvSchema.safeParse({ ...minimalEnv, PORT: "http" }).success).toBe(
    false,
  );
  expect(EnvSchema.safeParse({ ...minimalEnv, PORT: "99999" }).success).toBe(
    false,
  );
  expect(
    EnvSchema.safeParse({ ...minimalEnv, DATABASE_URL: "not a url" }).success,
  ).toBe(false);
});

it("infers typed config, not maybe-strings", () => {
  expectTypeOf<Env>().toEqualTypeOf<{
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    DATABASE_URL: string;
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
  }>();
});
