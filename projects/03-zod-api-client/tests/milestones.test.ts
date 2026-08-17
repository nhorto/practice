/**
 * Milestone tests — all OFFLINE. No network, ever: fixture JSON stands in
 * for the real PokeAPI (the fixtures are hand-copied subsets of real
 * responses), and milestone-2 tests inject a fake `fetch`.
 *
 * Blocks use `describe.skip` because the starter stubs throw — remove the
 * `.skip` when you start a milestone. Milestone-1 tests are skipped too:
 * they describe the FULL schemas, which the starter deliberately doesn't
 * have yet.
 */
import { readFileSync } from "node:fs";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import {
  NamedResourceSchema,
  PokemonSchema,
  TypeInfoSchema,
  type Pokemon,
} from "../src/schemas";
import { fetchAndParse } from "../src/client";
import { toPokemonSummary, type PokemonSummary } from "../src/transform";
import {
  createCache,
  toPokemonId,
  toPokemonName,
  type PokemonId,
} from "../src/cache";
import { formatReport } from "../src/report";

/** Load a fixture as `unknown` — boundary data is unknown until parsed. */
const fixture = (name: string): unknown =>
  JSON.parse(
    readFileSync(new URL(`../fixtures/${name}.json`, import.meta.url), "utf8"),
  );

const pikachu = fixture("pokemon-pikachu");
const bulbasaur = fixture("pokemon-bulbasaur");
const electric = fixture("type-electric");

/** A fake fetch serving canned JSON — how milestone 2 stays offline. */
const fakeFetch = (status: number, body: unknown): typeof fetch =>
  vi.fn(async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    }),
  );

// ---------------------------------------------------------------------------
// Milestone 0 — starter sanity (already green; leave un-skipped)
// ---------------------------------------------------------------------------
describe("milestone 0 — starter sanity", () => {
  it("fixtures are valid JSON with real PokeAPI ids", () => {
    expect(pikachu).toMatchObject({ id: 25, name: "pikachu" });
    expect(bulbasaur).toMatchObject({ id: 1, name: "bulbasaur" });
    expect(electric).toMatchObject({ id: 13, name: "electric" });
  });

  it("starter schemas parse the shared subset", () => {
    expect(PokemonSchema.safeParse(pikachu).success).toBe(true);
    expect(TypeInfoSchema.safeParse(electric).success).toBe(true);
    expect(
      NamedResourceSchema.safeParse({
        name: "ground",
        url: "https://pokeapi.co/api/v2/type/5/",
      }).success,
    ).toBe(true);
  });

  it("rejects garbage even with the starter schemas", () => {
    expect(PokemonSchema.safeParse({ id: -1, name: 42 }).success).toBe(false);
    expect(NamedResourceSchema.safeParse({ name: "x", url: "not a url" }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Milestone 1 — schema-first: model the API subset
// (skipped: the starter schemas are minimal on purpose — remove `.skip`
//  when you start milestone 1 and grow the schemas until green)
// ---------------------------------------------------------------------------
describe.skip("milestone 1 — full schemas", () => {
  it("PokemonSchema captures the full fixture shape", () => {
    const result = PokemonSchema.safeParse(pikachu);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [{ slot: 1, type: { name: "electric" } }],
      abilities: [
        { ability: { name: "static" }, is_hidden: false },
        { ability: { name: "lightning-rod" }, is_hidden: true },
      ],
    });
  });

  it("parses stats into typed entries", () => {
    const result = PokemonSchema.safeParse(bulbasaur);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      stats: [{ base_stat: 45, stat: { name: "hp" } }],
    });
  });

  it("rejects a pokemon with a malformed nested url", () => {
    const bad = {
      ...(pikachu as Record<string, unknown>),
      types: [{ slot: 1, type: { name: "electric", url: "nope" } }],
    };
    expect(PokemonSchema.safeParse(bad).success).toBe(false);
  });

  it("TypeInfoSchema captures damage_relations", () => {
    const result = TypeInfoSchema.safeParse(electric);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      damage_relations: {
        double_damage_from: [{ name: "ground" }],
        no_damage_to: [{ name: "ground" }],
      },
    });
  });
});

// ---------------------------------------------------------------------------
// Milestone 2 — fetchAndParse (offline via injected fetch)
// (skipped: remove `.skip` when you start milestone 2)
// ---------------------------------------------------------------------------
describe.skip("milestone 2 — fetchAndParse", () => {
  it("returns ok with the parsed value on a 200 + valid body", async () => {
    const result = await fetchAndParse(
      "https://pokeapi.co/api/v2/pokemon/pikachu",
      PokemonSchema,
      fakeFetch(200, pikachu),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("pikachu");
      expectTypeOf(result.value).toEqualTypeOf<Pokemon>();
    }
  });

  it("returns an http error for a 404 (and does not try to parse)", async () => {
    const result = await fetchAndParse(
      "https://pokeapi.co/api/v2/pokemon/missingno",
      PokemonSchema,
      fakeFetch(404, { detail: "Not found." }),
    );
    expect(result).toMatchObject({
      ok: false,
      error: { kind: "http", status: 404 },
    });
  });

  it("returns a parse error when the body fails the schema", async () => {
    const result = await fetchAndParse(
      "https://pokeapi.co/api/v2/pokemon/weird",
      PokemonSchema,
      fakeFetch(200, { totally: "wrong" }),
    );
    expect(result).toMatchObject({ ok: false, error: { kind: "parse" } });
  });

  it("returns a network error when fetch rejects — it never throws", async () => {
    const rejecting: typeof fetch = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    });
    const result = await fetchAndParse(
      "https://pokeapi.co/api/v2/pokemon/pikachu",
      PokemonSchema,
      rejecting,
    );
    expect(result).toMatchObject({ ok: false, error: { kind: "network" } });
  });
});

// ---------------------------------------------------------------------------
// Milestone 3 — transforms: API shape -> clean domain shape
// (skipped: remove `.skip` when you start milestone 3 — needs milestone 1's
//  full PokemonSchema first)
// ---------------------------------------------------------------------------
describe.skip("milestone 3 — toPokemonSummary", () => {
  it("converts units and flattens types/stats", () => {
    const summary = toPokemonSummary(PokemonSchema.parse(pikachu));
    expect(summary).toMatchObject({
      id: 25,
      name: "pikachu",
      heightMeters: 0.4, // 4 decimeters
      weightKg: 6, // 60 hectograms
      baseExperience: 112,
      types: ["electric"],
    });
    expect(summary.stats).toMatchObject({ hp: 35, speed: 90 });
  });

  it("keeps multi-type ordering by slot", () => {
    const summary = toPokemonSummary(PokemonSchema.parse(bulbasaur));
    expect(summary.types).toEqual(["grass", "poison"]);
  });
});

// ---------------------------------------------------------------------------
// Milestone 4 — branded ids + typed cache
// (skipped: remove `.skip` when you start milestone 4)
// ---------------------------------------------------------------------------
describe.skip("milestone 4 — brands and cache", () => {
  it("brands are numbers at runtime, distinct types at compile time", () => {
    const id = toPokemonId(25);
    expect(id).toBe(25);
    expectTypeOf(id).toEqualTypeOf<PokemonId>();
    expectTypeOf<PokemonId>().not.toEqualTypeOf<number>();
    // @ts-expect-error — a bare number is NOT a PokemonId
    const smuggled: PokemonId = 25;
    expect(smuggled).toBe(25);
  });

  it("toPokemonId rejects invalid input by throwing (programmer error)", () => {
    expect(() => toPokemonId(-1)).toThrow();
    expect(() => toPokemonId(2.5)).toThrow();
  });

  it("toPokemonName normalizes", () => {
    expect(toPokemonName("  Pikachu ")).toBe("pikachu");
  });

  it("cache get/set round-trips", () => {
    const cache = createCache<PokemonId, string>();
    const id = toPokemonId(25);
    expect(cache.get(id)).toBeUndefined();
    cache.set(id, "pikachu");
    expect(cache.get(id)).toBe("pikachu");
  });

  it("getOrLoad only loads once per key", async () => {
    const cache = createCache<string, number>();
    const load = vi.fn(async () => 42);
    expect(await cache.getOrLoad("answer", load)).toBe(42);
    expect(await cache.getOrLoad("answer", load)).toBe(42);
    expect(load).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Milestone 5 — the report (pure formatting; CLI wiring is manual-tested)
// (skipped: remove `.skip` when you start milestone 5)
// ---------------------------------------------------------------------------
describe.skip("milestone 5 — formatReport", () => {
  const summary: PokemonSummary = {
    id: 25,
    name: "pikachu",
    heightMeters: 0.4,
    weightKg: 6,
    baseExperience: 112,
    types: ["electric"],
    stats: { hp: 35, attack: 55, speed: 90 },
  };

  it("includes name, types and stats for every pokemon", () => {
    const report = formatReport([summary]);
    expect(report).toContain("pikachu");
    expect(report).toContain("electric");
    expect(report).toContain("90"); // speed shows up somewhere
  });

  it("handles an empty list without exploding", () => {
    expect(typeof formatReport([])).toBe("string");
  });
});
