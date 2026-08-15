/**
 * CLI entry — the one place that does REAL network calls.
 * Run:  pnpm --filter project-zod-api-client start pikachu bulbasaur
 *
 * Tests never import this file; they exercise the pure modules against
 * fixtures. In milestone 5 you wire this to:
 *   fetchAndParse(`${BASE_URL}/pokemon/${name}`, PokemonSchema)
 *     -> toPokemonSummary -> formatReport -> console.log
 * with a cache from milestone 4 in the middle.
 */

const main = async (): Promise<void> => {
  const names = process.argv.slice(2);

  if (names.length === 0) {
    console.log("Usage: pnpm start <pokemon-name> [...more names]");
    console.log("Example: pnpm start pikachu bulbasaur");
    return;
  }

  console.error(
    "Not wired up yet — this comes together in milestone 5 (see GUIDE.md).",
  );
  process.exitCode = 1;
};

await main();

// Top-level await requires the file to be a module; once you import your
// milestone functions above, this empty export can go.
export {};
