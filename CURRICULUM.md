# TypeScript Dojo — 8-Week Curriculum

The goal: **write TypeScript like a TypeScript dev** — fluently, from muscle
memory, following the patterns Matt Pocock (Total TypeScript) and the T3
community teach. Roughly 1–2 hours a day, 5 days a week, hands on the keyboard.

## How a day works

1. **Read** the day's `README.md` in `packages/exercises/week-XX/day-XX/` —
   it links the relevant [Total TypeScript Essentials](https://www.totaltypescript.com/books/total-typescript-essentials)
   chapter (free online; verified mirrors of each chapter are linked from the day READMEs).
2. **Drill** — run `pnpm exercise <week>-<day>` and fix each `.problem.ts`
   until tests *and* types are green. Type everything out; no copy/paste.
3. **Build** — most days end with a milestone from the current
   [project](./projects/README.md). This is where structure and repo-layout
   skills come from.
4. **Track** — check the day off in the web dashboard (`pnpm web`).

Quick drills away from your machine: the dashboard's `/playground` has a
Monaco editor (the guts of VS Code) with full TypeScript checking in the browser.

## Weekly map

Chapter references are to *Total TypeScript Essentials* (TT).

### Week 1 — Fundamentals: annotations, unions, narrowing
| Day | Session | Reading |
|-----|---------|---------|
| 1 | Type annotations & functions | TT ch. 4 |
| 2 | Arrays, tuples, optional & rest params, `any` vs `unknown` | TT ch. 4 |
| 3 | Unions, literal types, narrowing | TT ch. 5 |
| 4 | Discriminated unions, `unknown` & `never` | TT ch. 5 |
| 5 | Tooling: `tsc`, the dev pipeline, IDE superpowers + review drills | TT ch. 1–3 |

**Project:** [01 — CLI Task Tracker](./projects/01-cli-task-tracker) (starts day 3)

### Week 2 — Objects, mutability, deriving types
| Day | Session | Reading |
|-----|---------|---------|
| 1 | Object types, `interface extends` vs intersections, index signatures | TT ch. 6 |
| 2 | Utility types: `Pick`/`Omit`/`Partial`/`Record` + `keyof` | TT ch. 6, 10 |
| 3 | Mutability: `as const`, `readonly`, inference of `let` vs `const` | TT ch. 7 |
| 4 | Deriving types: `typeof`, indexed access, `ReturnType`, `Awaited` | TT ch. 10 |
| 5 | Annotations vs assertions: `as`, `!`, `satisfies` + review drills | TT ch. 11 |

**Project:** CLI Task Tracker milestones 3–5 (persistence, filtering, deriving types from data)

### Week 3 — Generics: the heart of TypeScript
| Day | Session | Reading |
|-----|---------|---------|
| 1 | Generic functions: type parameters, constraints, defaults | TT ch. 16 |
| 2 | Generic types & data structures: `Result<T, E>`, typed collections | TT ch. 15 |
| 3 | Function overloads, type predicates, assertion functions | TT ch. 16 |
| 4 | Template literal types & mapped types | TT ch. 15 |
| 5 | Conditional types & `infer` + review drills | TT ch. 15 |

**Project:** [02 — `ts-utils` typed library](./projects/02-ts-utils-library)

### Week 4 — Building real apps: modules, config, patterns
| Day | Session | Reading |
|-----|---------|---------|
| 1 | Modules: ESM/CJS, `import type`, declaration files | TT ch. 13 |
| 2 | `tsconfig` deep dive + a guided tour of *this repo's* monorepo | TT ch. 14 |
| 3 | Enums vs `as const` objects, TS-only features, the weird parts | TT ch. 9, 12 |
| 4 | Error handling: `Result` types, exhaustive switches, typed errors | — |
| 5 | Branded types & designing your types | TT ch. 15 |

**Project:** `ts-utils` library milestones 4–6 (packaging, exports, publishing setup)

### Week 5 — Zod: types at runtime
| Day | Session | Reading |
|-----|---------|---------|
| 1 | Parse, don't validate: `z.object`, `safeParse`, `z.infer` | [zod.dev](https://zod.dev) |
| 2 | Composing schemas: unions, arrays, records, `extend`, `strictObject` | zod.dev |
| 3 | Transforms, refinements, pipes, coercion, defaults | zod.dev |
| 4 | Validating boundaries: env vars (t3-env pattern), `fetch` + Zod | [t3-env](https://env.t3.gg) |
| 5 | Branded types with Zod + review drills | — |

**Project:** [03 — Typed API client](./projects/03-zod-api-client)

### Week 6 — React + TypeScript patterns
| Day | Session | Reading |
|-----|---------|---------|
| 1 | Typing components: props, `children`, why not `React.FC` | [React TS Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) |
| 2 | Hooks: `useState`, `useRef` (React 19 rules), `useReducer` + discriminated actions | cheatsheet |
| 3 | Events & DOM: `ComponentProps`, extending native elements | cheatsheet |
| 4 | Discriminated union props & generic components | — |
| 5 | Custom hooks, context, Zod inside hooks | — |

**Project:** [04 — React Todo app](./projects/04-react-todo) (CSS is provided — you write types & logic, not styles)

### Week 7 — Drizzle: the typed database
| Day | Session | Reading |
|-----|---------|---------|
| 1 | Schema definition, `$inferSelect` / `$inferInsert` | [orm.drizzle.team](https://orm.drizzle.team) |
| 2 | Queries: select/insert/update/delete + operators | drizzle docs |
| 3 | Relations, relational queries, migrations with drizzle-kit | drizzle docs |
| 4 | Full-stack boundaries: server actions + Zod + Drizzle | — |
| 5 | Project focus day | — |

**Project:** [05 — Full-stack notes app](./projects/05-fullstack-notes) (Next.js + Drizzle + Zod)

### Week 8 — Advanced patterns & capstone
| Day | Session | Reading |
|-----|---------|---------|
| 1 | The weird parts: excess property checks, function assignability | TT ch. 12 |
| 2 | Advanced generics workout: builders, typed event emitters | — |
| 3 | Type-challenges workout | [type-challenges](https://github.com/type-challenges/type-challenges) |
| 4 | Typing AI/LLM apps: tool definitions, streaming events, SDK patterns | — |
| 5 | Capstone kickoff + what to practice forever | — |

**Project:** [06 — Capstone: AI prompt library](./projects/06-capstone-ai-app)

## The style rules this curriculum drills (the "TS dev, not Python dev" list)

1. **Derive, don't declare.** One source of truth: `typeof`, `keyof`, indexed
   access, `z.infer`, `$inferSelect` — never hand-write a type you can derive.
2. **No enums.** `as const` objects + derived unions instead.
3. **`type` by default; `interface` only for `extends`.**
4. **`any` is forbidden; `unknown` + narrowing at boundaries.** Zod at the
   edges of your app (API responses, env, forms).
5. **Let inference work.** Annotate parameters, not everything else.
6. **Make invalid states unrepresentable.** Discriminated unions over boolean
   flags, exhaustive `switch` with `never` checks.
7. **`satisfies` for validated configs**, `as` almost never, `!` rarely.
8. **Errors are values at boundaries.** `Result`/discriminated returns where
   failure is expected; `throw` for bugs.
