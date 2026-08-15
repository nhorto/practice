/**
 * Exercise 01 — An env schema (solution)
 *
 * Strings in, typed config out: the enum narrows NODE_ENV to a literal
 * union, coercion turns "8080" into 8080, and defaults document the
 * optional knobs right where they're declared.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

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
