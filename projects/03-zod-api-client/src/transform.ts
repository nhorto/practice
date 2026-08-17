/**
 * Milestone 3 — turn raw API shapes (snake_case, nested { name, url } refs)
 * into clean camelCase domain types the rest of the app actually wants.
 */
import type { Pokemon } from "./schemas";

/**
 * The domain shape — this one IS hand-written, because it's OUR design, not
 * a mirror of the API. (Mirrors get derived; designs get declared.)
 */
export type PokemonSummary = {
  id: number;
  name: string;
  heightMeters: number;
  weightKg: number;
  baseExperience: number;
  /** e.g. ["grass", "poison"] — flattened from the API's slot objects. */
  types: string[];
  /** stat name -> base value, e.g. { hp: 35, speed: 90, ... } */
  stats: Record<string, number>;
};

/**
 * Milestone 3 — map a parsed Pokemon to the domain summary.
 * PokeAPI units: height is in decimeters, weight in hectograms.
 */
export const toPokemonSummary = (pokemon: Pokemon): PokemonSummary => {
  throw new Error("TODO: milestone 3");
};
