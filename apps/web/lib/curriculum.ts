/**
 * The 8-week TypeScript Dojo curriculum, transcribed from /CURRICULUM.md.
 *
 * Single source of truth: the data is `as const` (validated by `satisfies`),
 * and every type the app needs is *derived* from it — never hand-written.
 */

type Day = {
  day: number;
  slug: `${string}-${string}`;
  title: string;
  reading: string;
};

type Project = {
  name: string;
  path: `projects/${string}`;
  note: string;
};

type Week = {
  id: number;
  code: string;
  title: string;
  project: Project;
  days: readonly Day[];
};

export const curriculum = [
  {
    id: 1,
    code: "01",
    title: "Fundamentals: annotations, unions, narrowing",
    project: {
      name: "01 — CLI Task Tracker",
      path: "projects/01-cli-task-tracker",
      note: "starts day 3",
    },
    days: [
      { day: 1, slug: "01-01", title: "Type annotations & functions", reading: "TT ch. 4" },
      {
        day: 2,
        slug: "01-02",
        title: "Arrays, tuples, optional & rest params, `any` vs `unknown`",
        reading: "TT ch. 4",
      },
      { day: 3, slug: "01-03", title: "Unions, literal types, narrowing", reading: "TT ch. 5" },
      {
        day: 4,
        slug: "01-04",
        title: "Discriminated unions, `unknown` & `never`",
        reading: "TT ch. 5",
      },
      {
        day: 5,
        slug: "01-05",
        title: "Tooling: `tsc`, the dev pipeline, IDE superpowers + review drills",
        reading: "TT ch. 1–3",
      },
    ],
  },
  {
    id: 2,
    code: "02",
    title: "Objects, mutability, deriving types",
    project: {
      name: "CLI Task Tracker — milestones 3–5",
      path: "projects/01-cli-task-tracker",
      note: "persistence, filtering, deriving types from data",
    },
    days: [
      {
        day: 1,
        slug: "02-01",
        title: "Object types, `interface extends` vs intersections, index signatures",
        reading: "TT ch. 6",
      },
      {
        day: 2,
        slug: "02-02",
        title: "Utility types: `Pick`/`Omit`/`Partial`/`Record` + `keyof`",
        reading: "TT ch. 6, 10",
      },
      {
        day: 3,
        slug: "02-03",
        title: "Mutability: `as const`, `readonly`, inference of `let` vs `const`",
        reading: "TT ch. 7",
      },
      {
        day: 4,
        slug: "02-04",
        title: "Deriving types: `typeof`, indexed access, `ReturnType`, `Awaited`",
        reading: "TT ch. 10",
      },
      {
        day: 5,
        slug: "02-05",
        title: "Annotations vs assertions: `as`, `!`, `satisfies` + review drills",
        reading: "TT ch. 11",
      },
    ],
  },
  {
    id: 3,
    code: "03",
    title: "Generics: the heart of TypeScript",
    project: {
      name: "02 — `ts-utils` typed library",
      path: "projects/02-ts-utils-library",
      note: "milestones 1–3",
    },
    days: [
      {
        day: 1,
        slug: "03-01",
        title: "Generic functions: type parameters, constraints, defaults",
        reading: "TT ch. 16",
      },
      {
        day: 2,
        slug: "03-02",
        title: "Generic types & data structures: `Result<T, E>`, typed collections",
        reading: "TT ch. 15",
      },
      {
        day: 3,
        slug: "03-03",
        title: "Function overloads, type predicates, assertion functions",
        reading: "TT ch. 16",
      },
      {
        day: 4,
        slug: "03-04",
        title: "Template literal types & mapped types",
        reading: "TT ch. 15",
      },
      {
        day: 5,
        slug: "03-05",
        title: "Conditional types & `infer` + review drills",
        reading: "TT ch. 15",
      },
    ],
  },
  {
    id: 4,
    code: "04",
    title: "Building real apps: modules, config, patterns",
    project: {
      name: "`ts-utils` library — milestones 4–6",
      path: "projects/02-ts-utils-library",
      note: "packaging, exports, publishing setup",
    },
    days: [
      {
        day: 1,
        slug: "04-01",
        title: "Modules: ESM/CJS, `import type`, declaration files",
        reading: "TT ch. 13",
      },
      {
        day: 2,
        slug: "04-02",
        title: "`tsconfig` deep dive + a guided tour of this repo's monorepo",
        reading: "TT ch. 14",
      },
      {
        day: 3,
        slug: "04-03",
        title: "Enums vs `as const` objects, TS-only features, the weird parts",
        reading: "TT ch. 9, 12",
      },
      {
        day: 4,
        slug: "04-04",
        title: "Error handling: `Result` types, exhaustive switches, typed errors",
        reading: "—",
      },
      {
        day: 5,
        slug: "04-05",
        title: "Branded types & designing your types",
        reading: "TT ch. 15",
      },
    ],
  },
  {
    id: 5,
    code: "05",
    title: "Zod: types at runtime",
    project: {
      name: "03 — Typed API client",
      path: "projects/03-zod-api-client",
      note: "parse, don't validate — at every boundary",
    },
    days: [
      {
        day: 1,
        slug: "05-01",
        title: "Parse, don't validate: `z.object`, `safeParse`, `z.infer`",
        reading: "zod.dev",
      },
      {
        day: 2,
        slug: "05-02",
        title: "Composing schemas: unions, arrays, records, `extend`, `strictObject`",
        reading: "zod.dev",
      },
      {
        day: 3,
        slug: "05-03",
        title: "Transforms, refinements, pipes, coercion, defaults",
        reading: "zod.dev",
      },
      {
        day: 4,
        slug: "05-04",
        title: "Validating boundaries: env vars (t3-env pattern), `fetch` + Zod",
        reading: "t3-env",
      },
      {
        day: 5,
        slug: "05-05",
        title: "Branded types with Zod + review drills",
        reading: "—",
      },
    ],
  },
  {
    id: 6,
    code: "06",
    title: "React + TypeScript patterns",
    project: {
      name: "04 — React Todo app",
      path: "projects/04-react-todo",
      note: "CSS provided — you write types & logic, not styles",
    },
    days: [
      {
        day: 1,
        slug: "06-01",
        title: "Typing components: props, `children`, why not `React.FC`",
        reading: "React TS Cheatsheet",
      },
      {
        day: 2,
        slug: "06-02",
        title: "Hooks: `useState`, `useRef` (React 19 rules), `useReducer` + discriminated actions",
        reading: "cheatsheet",
      },
      {
        day: 3,
        slug: "06-03",
        title: "Events & DOM: `ComponentProps`, extending native elements",
        reading: "cheatsheet",
      },
      {
        day: 4,
        slug: "06-04",
        title: "Discriminated union props & generic components",
        reading: "—",
      },
      {
        day: 5,
        slug: "06-05",
        title: "Custom hooks, context, Zod inside hooks",
        reading: "—",
      },
    ],
  },
  {
    id: 7,
    code: "07",
    title: "Drizzle: the typed database",
    project: {
      name: "05 — Full-stack notes app",
      path: "projects/05-fullstack-notes",
      note: "Next.js + Drizzle + Zod",
    },
    days: [
      {
        day: 1,
        slug: "07-01",
        title: "Schema definition, `$inferSelect` / `$inferInsert`",
        reading: "orm.drizzle.team",
      },
      {
        day: 2,
        slug: "07-02",
        title: "Queries: select/insert/update/delete + operators",
        reading: "drizzle docs",
      },
      {
        day: 3,
        slug: "07-03",
        title: "Relations, relational queries, migrations with drizzle-kit",
        reading: "drizzle docs",
      },
      {
        day: 4,
        slug: "07-04",
        title: "Full-stack boundaries: server actions + Zod + Drizzle",
        reading: "—",
      },
      { day: 5, slug: "07-05", title: "Project focus day", reading: "—" },
    ],
  },
  {
    id: 8,
    code: "08",
    title: "Advanced patterns & capstone",
    project: {
      name: "06 — Capstone: AI prompt library",
      path: "projects/06-capstone-ai-app",
      note: "everything, together",
    },
    days: [
      {
        day: 1,
        slug: "08-01",
        title: "The weird parts: excess property checks, function assignability",
        reading: "TT ch. 12",
      },
      {
        day: 2,
        slug: "08-02",
        title: "Advanced generics workout: builders, typed event emitters",
        reading: "—",
      },
      {
        day: 3,
        slug: "08-03",
        title: "Type-challenges workout",
        reading: "type-challenges",
      },
      {
        day: 4,
        slug: "08-04",
        title: "Typing AI/LLM apps: tool definitions, streaming events, SDK patterns",
        reading: "—",
      },
      {
        day: 5,
        slug: "08-05",
        title: "Capstone kickoff + what to practice forever",
        reading: "—",
      },
    ],
  },
] as const satisfies readonly Week[];

/** 1 | 2 | ... | 8 — derived, not declared. */
export type WeekId = (typeof curriculum)[number]["id"];

/** "01-01" | "01-02" | ... | "08-05" — the 40 session slugs. */
export type DaySlug = (typeof curriculum)[number]["days"][number]["slug"];

export const totalSessions = curriculum.reduce((sum, week) => sum + week.days.length, 0);

const allSlugs: ReadonlySet<string> = new Set(
  curriculum.flatMap((week) => week.days.map((day) => day.slug)),
);

export const isDaySlug = (value: unknown): value is DaySlug =>
  typeof value === "string" && allSlugs.has(value);

export const exerciseCommand = (slug: DaySlug) => `pnpm exercise ${slug}` as const;
