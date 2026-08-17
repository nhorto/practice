/**
 * Exercise runner.
 *
 * Usage (from the repo root or packages/exercises):
 *
 *   pnpm exercise 01-03              # watch all of week 1, day 3's problem files
 *   pnpm exercise 01-03 2            # watch only exercise 02 of that day
 *   pnpm exercise 01-03 --solution   # watch the day's solution files instead
 *
 * It starts vitest in watch mode with type-checking enabled, so you get both
 * runtime test failures AND type errors in the same feedback loop. Fix the
 * .problem.ts file until everything is green, then compare with .solution.ts.
 */
import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const packageRoot = path.resolve(import.meta.dirname, "..");

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`);
  console.error("Usage: pnpm exercise <week>-<day> [exercise-number] [--solution]");
  console.error("Example: pnpm exercise 01-03");
  process.exit(1);
}

const args = process.argv.slice(2);
const wantSolution = args.includes("--solution");
const positional = args.filter((a) => !a.startsWith("-"));

const target = positional[0];
if (!target) {
  fail("Tell me which day to run, e.g. `pnpm exercise 01-03` for week 1, day 3.");
}

const match = target.match(/^(\d{1,2})-(\d{1,2})$/);
if (!match) {
  fail(`"${target}" doesn't look like <week>-<day>. Try something like 01-03.`);
}

const weekNum = Number(match[1]);
const dayNum = Number(match[2]);

function findDir(parent: string, prefix: string, num: number): string {
  const pattern = new RegExp(`^${prefix}-0?${num}\\b`);
  const found = readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && pattern.test(entry.name))
    .map((entry) => entry.name);
  const dir = found[0];
  if (!dir) {
    fail(`Couldn't find a ${prefix} numbered ${num} in ${parent}.`);
  }
  return path.join(parent, dir);
}

const weekDir = findDir(packageRoot, "week", weekNum);
const dayDir = findDir(weekDir, "day", dayNum);

const kind = wantSolution ? "solution" : "problem";
let files = readdirSync(dayDir)
  .filter((name) => name.includes(`.${kind}.`))
  .sort();

const exerciseNum = positional[1];
if (exerciseNum) {
  const padded = exerciseNum.padStart(2, "0");
  files = files.filter((name) => name.startsWith(`${padded}-`));
}

if (files.length === 0) {
  fail(`No ${kind} files found in ${dayDir}${exerciseNum ? ` for exercise ${exerciseNum}` : ""}.`);
}

const relativeDay = path.relative(packageRoot, dayDir);
console.log(`\n📘 ${relativeDay}`);
console.log(`   Read the session guide first: ${path.join("packages/exercises", relativeDay, "README.md")}`);
console.log(`   Running ${kind} files:`);
for (const file of files) {
  console.log(`   - ${file}`);
}
console.log("");

const child = spawn(
  "pnpm",
  ["exec", "vitest", "watch", ...files.map((f) => path.join(relativeDay, f))],
  { cwd: packageRoot, stdio: "inherit" },
);

child.on("exit", (code) => process.exit(code ?? 0));
