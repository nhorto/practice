/**
 * Exercise 02 — `Partial` and `Required` (solution)
 *
 * The patch is `Partial<Settings>` — callers mention only what changes. The
 * resolver returns `Required<ServerConfig>` — callers downstream never have
 * to null-check a config value again.
 */
import { expect, expectTypeOf, it } from "vitest";

type Settings = {
  theme: "light" | "dark";
  fontSize: number;
  language: string;
};

const updateSettings = (current: Settings, patch: Partial<Settings>): Settings => {
  return { ...current, ...patch };
};

type ServerConfig = {
  port?: number;
  host?: string;
  verbose?: boolean;
};

const resolveConfig = (config: ServerConfig): Required<ServerConfig> => {
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
