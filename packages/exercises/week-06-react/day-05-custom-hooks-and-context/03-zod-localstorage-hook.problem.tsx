/**
 * Exercise 03 — A Zod-validated localStorage hook
 *
 * localStorage hands back `string | null` of unknown vintage — a classic
 * boundary. `JSON.parse` + `schema.safeParse` already handle the runtime
 * side below. What's missing is the TYPE side: `parseStored` returns
 * `unknown`, so the hook's state is `unknown` too. Make the helper generic
 * over the schema's OUTPUT type and the whole chain infers itself.
 *
 * 🎯 Retype `parseStored` as `<Output>(schema: z.ZodType<Output>, raw: string | null)
 *    => Output | null`. Don't touch the hook — watch its tuple type snap
 *    into place on its own.
 */
import { useState } from "react";
import { z } from "zod";
import { expect, expectTypeOf, it } from "vitest";

const SettingsSchema = z.object({
  volume: z.number().min(0).max(100),
  theme: z.enum(["light", "dark"]),
});

type Settings = z.infer<typeof SettingsSchema>;

export const parseStored = (schema: z.ZodType, raw: string | null) => {
  if (raw === null) return null;
  try {
    const json: unknown = JSON.parse(raw);
    const result = schema.safeParse(json);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

const useStoredSettings = (storageKey: string) => {
  const [settings, setSettings] = useState(() =>
    parseStored(SettingsSchema, localStorage.getItem(storageKey)),
  );

  const save = (next: Settings) => {
    localStorage.setItem(storageKey, JSON.stringify(next));
    setSettings(next);
  };

  return [settings, save] as const;
};

// --- tests ------------------------------------------------------------------

it("returns typed data for valid stored JSON", () => {
  const parsed = parseStored(SettingsSchema, '{"volume":40,"theme":"dark"}');
  expect(parsed).toEqual({ volume: 40, theme: "dark" });
  expectTypeOf(parsed).toEqualTypeOf<Settings | null>();
});

it("returns null for bad JSON, wrong shapes, and empty storage", () => {
  expect(parseStored(SettingsSchema, "{volume:")).toBeNull();
  expect(parseStored(SettingsSchema, '{"volume":"loud","theme":"dark"}')).toBeNull();
  expect(parseStored(SettingsSchema, '{"volume":40}')).toBeNull();
  expect(parseStored(SettingsSchema, null)).toBeNull();
});

it("works for any schema, not just Settings", () => {
  const TagsSchema = z.array(z.string());
  const tags = parseStored(TagsSchema, '["ts","react"]');
  expect(tags).toEqual(["ts", "react"]);
  expectTypeOf(tags).toEqualTypeOf<string[] | null>();
});

it("the hook's tuple type follows from parseStored's signature", () => {
  expectTypeOf(useStoredSettings).returns.toEqualTypeOf<
    readonly [Settings | null, (next: Settings) => void]
  >();
});
