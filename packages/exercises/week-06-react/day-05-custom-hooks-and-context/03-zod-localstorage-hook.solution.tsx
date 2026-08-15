/**
 * Exercise 03 — A Zod-validated localStorage hook (solution)
 *
 * The generic is over the schema's OUTPUT type: `schema: z.ZodType<Output>`
 * makes `safeParse` return typed data, so `Output | null` flows out with no
 * casts. Passing `SettingsSchema` infers `Output = Settings`, the `useState`
 * initializer picks that up, and the hook's tuple type falls out for free —
 * one signature fixed, the whole chain typed.
 */
import { useState } from "react";
import { z } from "zod";
import { expect, expectTypeOf, it } from "vitest";

const SettingsSchema = z.object({
  volume: z.number().min(0).max(100),
  theme: z.enum(["light", "dark"]),
});

type Settings = z.infer<typeof SettingsSchema>;

export const parseStored = <Output,>(
  schema: z.ZodType<Output>,
  raw: string | null,
): Output | null => {
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
