/**
 * Exercise 02 — `Partial` and `Required`
 *
 * `Partial<T>` makes every property optional — the natural type for a patch:
 * "change only what I mention". `Required<T>` is the mirror image — the
 * natural RETURN type for a resolver that fills in every default.
 *
 * 🎯 1. `updateSettings` should accept a patch with any subset of fields,
 *       but its annotation demands ALL of them. Fix the `patch` parameter.
 *    2. `resolveConfig` fills in every default, but its return type still
 *       says everything is optional. Promise more: `Required<ServerConfig>`.
 */
import { expect, expectTypeOf, it } from "vitest";

type Settings = {
  theme: "light" | "dark";
  fontSize: number;
  language: string;
};

const updateSettings = (current: Settings, patch: Settings): Settings => {
  return { ...current, ...patch };
};

type ServerConfig = {
  port?: number;
  host?: string;
  verbose?: boolean;
};

const resolveConfig = (config: ServerConfig): ServerConfig => {
  return {
    port: config.port ?? 3000,
    host: config.host ?? "localhost",
    verbose: config.verbose ?? false,
  };
};

// --- tests ------------------------------------------------------------------

const defaults: Settings = { theme: "light", fontSize: 14, language: "en" };

it("applies a partial patch", () => {
  expect(updateSettings(defaults, { theme: "dark" })).toEqual({
    theme: "dark",
    fontSize: 14,
    language: "en",
  });
  expect(updateSettings(defaults, {})).toEqual(defaults);
});

it("resolves every config default", () => {
  expect(resolveConfig({})).toEqual({
    port: 3000,
    host: "localhost",
    verbose: false,
  });
  expect(resolveConfig({ port: 8080 }).port).toBe(8080);
});

it("has the correct signatures", () => {
  expectTypeOf(updateSettings).toEqualTypeOf<
    (current: Settings, patch: Partial<Settings>) => Settings
  >();
  expectTypeOf(resolveConfig).toEqualTypeOf<
    (config: ServerConfig) => Required<ServerConfig>
  >();
});
