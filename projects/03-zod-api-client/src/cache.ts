/**
 * Milestone 4 — a typed cache + branded IDs.
 *
 * Brands make "a number that is specifically a Pokémon id" a distinct type:
 * you can't pass a random number (or a TypeId!) where a PokemonId is
 * expected, even though both are numbers at runtime.
 */

declare const brand: unique symbol;
export type Brand<T, B extends string> = T & { readonly [brand]: B };

export type PokemonId = Brand<number, "PokemonId">;
export type PokemonName = Brand<string, "PokemonName">;

/**
 * Milestone 4 — the ONLY way to mint a PokemonId (validate, then brand).
 * Reject non-positive / non-integer input by throwing: a bad id here is a
 * programmer error, not an expected failure.
 */
export const toPokemonId = (id: number): PokemonId => {
  throw new Error("TODO: milestone 4");
};

/** Milestone 4 — normalize (trim, lowercase) then brand. */
export const toPokemonName = (name: string): PokemonName => {
  throw new Error("TODO: milestone 4");
};

export type Cache<K, V> = {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => void;
  /** Return the cached value, or run `load`, cache its result, and return it. */
  getOrLoad: (key: K, load: () => Promise<V>) => Promise<V>;
};

/** Milestone 4 — a Map-backed cache satisfying the Cache contract. */
export const createCache = <K, V>(): Cache<K, V> => {
  throw new Error("TODO: milestone 4");
};
