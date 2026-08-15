/**
 * Copies the Monaco editor bundle out of node_modules into public/vs so the
 * playground self-hosts it instead of fetching from a CDN.
 *
 * Why: the playground should work offline (practice on a plane), and the
 * runtime version should always match the `monaco-editor` types we compile
 * against. A CDN gives you neither.
 *
 * public/vs is gitignored — this runs automatically before `dev` and `build`.
 */
import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(webRoot, "node_modules", "monaco-editor", "min", "vs");
const destination = path.join(webRoot, "public", "vs");
const stampFile = path.join(webRoot, "public", "vs.version");

const { version } = JSON.parse(
  await readFile(path.join(webRoot, "node_modules", "monaco-editor", "package.json"), "utf8"),
);

const alreadyCurrent = async () => {
  try {
    await stat(destination);
    return (await readFile(stampFile, "utf8")).trim() === version;
  } catch {
    return false;
  }
};

if (await alreadyCurrent()) {
  process.exit(0);
}

await rm(destination, { recursive: true, force: true });
await mkdir(path.dirname(destination), { recursive: true });
await cp(source, destination, { recursive: true });
await writeFile(stampFile, `${version}\n`);

console.log(`✓ monaco ${version} synced to public/vs`);
