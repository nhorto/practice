/**
 * Milestone 1 — schema-first modelling of the PokeAPI subset we use.
 *
 * The starter schemas are deliberately MINIMAL (id + name). You will grow
 * them to match the fixture files in ../fixtures — those are hand-written
 * copies of real https://pokeapi.co response shapes, so they're your spec.
 *
 * Zod v4 notes (this repo uses zod 4 — older tutorials will mislead you):
 * - top-level string formats: z.url(), z.email() — NOT z.string().url()
 * - error message customization: { error: "..." } — NOT { message: "..." }
 * - z.strictObject(...) for closed shapes; .extend(...) — .merge is gone
 * - z.record(keySchema, valueSchema) always takes TWO arguments
 */
import { z } from "zod";

/** PokeAPI's ubiquitous { name, url } reference shape. */
export const NamedResourceSchema = z.object({
  name: z.string(),
  url: z.url(),
});

/** TODO milestone 1: grow to match fixtures/pokemon-*.json */
export const PokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

/** TODO milestone 1: grow to match fixtures/type-electric.json */
export const TypeInfoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

// Types are DERIVED from schemas — never hand-written next to them.
export type NamedResource = z.infer<typeof NamedResourceSchema>;
export type Pokemon = z.infer<typeof PokemonSchema>;
export type TypeInfo = z.infer<typeof TypeInfoSchema>;
