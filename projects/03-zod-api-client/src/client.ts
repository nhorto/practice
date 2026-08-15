/**
 * Milestone 2 — a generic, Result-returning fetch-and-validate.
 *
 * `fetchImpl` is injectable so tests can run fully offline (they pass a fake
 * fetch that serves fixture JSON). The CLI passes nothing and gets the real
 * global fetch.
 */
import type { ZodType } from "zod";
import type { FetchError, Result } from "./result";

export const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Milestone 2 — fetch `url`, then parse the JSON body with `schema`.
 * Never throws; every failure mode becomes a FetchError value:
 * - fetch rejected            -> { kind: "network", ... }
 * - non-2xx status            -> { kind: "http", ... }
 * - body fails schema         -> { kind: "parse", ... }
 */
export const fetchAndParse = async <T>(
  url: string,
  schema: ZodType<T>,
  fetchImpl: typeof fetch = fetch,
): Promise<Result<T, FetchError>> => {
  throw new Error("TODO: milestone 2");
};
