/**
 * Exercise 02 — A generic createEnv helper (solution)
 *
 * The generic parameter captures the exact schema the caller passes, and
 * v4's polymorphic method types make `safeParse` return
 * `z.output<TSchema>` on success — full inference, zero casts.
 * `z.flattenError` (v4's replacement for `error.flatten()`) turns the issue
 * list into a per-variable report.
 */
import { expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

const createEnv = <TSchema extends z.ZodType>(
  schema: TSchema,
  runtimeEnv: Record<string, string | undefined>,
): z.output<TSchema> => {
  const result = schema.safeParse(runtimeEnv);
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    throw new Error(`Invalid environment: ${JSON.stringify(fieldErrors)}`);
  }
  return result.data;
};

// --- tests ------------------------------------------------------------------

const AppEnvSchema = z.object({
  API_URL: z.url(),
  RETRIES: z.coerce.number().int().min(0).default(3),
});

it("returns fully typed config for a valid env", () => {
  const env = createEnv(AppEnvSchema, {
    API_URL: "https://api.example.com",
    NOISE: "ignored",
  });
  expect(env).toEqual({ API_URL: "https://api.example.com", RETRIES: 3 });
  expectTypeOf(env).toEqualTypeOf<{ API_URL: string; RETRIES: number }>();
});

it("works with any schema — inference comes from the argument", () => {
  const env = createEnv(z.object({ MODE: z.enum(["on", "off"]) }), {
    MODE: "on",
  });
  expect(env.MODE).toBe("on");
  expectTypeOf(env).toEqualTypeOf<{ MODE: "on" | "off" }>();
});

it("throws one readable report naming every bad variable", () => {
  expect(() =>
    createEnv(AppEnvSchema, { API_URL: "nope", RETRIES: "many" }),
  ).toThrow(Error);
  try {
    createEnv(AppEnvSchema, { API_URL: "nope", RETRIES: "many" });
    expect.unreachable("createEnv should have thrown");
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message).toContain("Invalid environment");
    expect(message).toContain("API_URL");
    expect(message).toContain("RETRIES");
  }
});
