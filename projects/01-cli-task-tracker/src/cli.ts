/**
 * CLI entry point. Run with:  pnpm start <command> [...args]
 *
 * The starter only prints help. In milestone 5 you wire the real pipeline:
 *   loadTasks -> parseCommand -> runCommand -> saveTasks -> print output
 * (import from ./storage, ./parse and ./run — their stubs throw until you
 * implement the earlier milestones, which is why they're not imported yet).
 */
import { HELP_TEXT } from "./run";

const main = (): void => {
  const argv = process.argv.slice(2);
  const [first] = argv;

  if (first === undefined || first === "help" || first === "--help") {
    console.log(HELP_TEXT);
    return;
  }

  console.error(`"${first}" isn't wired up yet.`);
  console.error(
    "This is the starter skeleton — commands come to life as you complete the milestones in GUIDE.md.",
  );
  process.exitCode = 1;
};

main();
