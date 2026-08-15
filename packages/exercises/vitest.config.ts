import { defineConfig } from "vitest/config";

// Exercise files are their own test files: runtime tests (it/expect) AND
// type-level tests (expectTypeOf, @ts-expect-error) live at the bottom of
// each .problem.ts / .solution.ts file.
//
// - `pnpm exercise 01-03` watches one day's problem files (red -> green loop)
// - `pnpm test:solutions` runs every solution file (should always be green)
export default defineConfig({
  test: {
    include: ["week-*/**/*.{problem,solution}.{ts,tsx}"],
    typecheck: {
      enabled: true,
      include: ["week-*/**/*.{problem,solution}.{ts,tsx}"],
      tsconfig: "./tsconfig.json",
      // Problem files contain intentional type errors. Without this, running
      // the solutions would also surface every unrelated problem file's
      // errors as "source errors". Errors in the files actually being run
      // are still reported.
      ignoreSourceErrors: true,
    },
  },
});
