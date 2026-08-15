import type { WeekId } from "./curriculum";

/**
 * Playground drills — small, self-checking exercises for the Monaco editor.
 * Success = the red squiggles disappear and/or the expected output prints.
 */

export type Drill = {
  id: string;
  title: string;
  topic: string;
  weekRef: WeekId;
  starterCode: string;
  hint: string;
};

export const drills = [
  {
    id: "annotate-functions",
    title: "Annotate the functions",
    topic: "Type annotations & inference",
    weekRef: 1,
    starterCode: `// Add parameter annotations so every error disappears.
// Style rule #5: annotate parameters, let the return type be inferred.

function add(a, b) {
  return a + b;
}

function greet(name, excited) {
  return excited ? \`Hello, \${name}!\` : \`Hello, \${name}.\`;
}

const double = (n) => n * 2;

console.log(add(2, 3));
console.log(greet("Ada", true));
console.log(double(21));
`,
    hint: 'Every parameter needs a type: add(a: number, b: number), greet(name: string, excited: boolean), double = (n: number) => ... Skip return-type annotations — inference handles them.',
  },
  {
    id: "fix-narrowing",
    title: "Fix the narrowing bug",
    topic: "Unions & narrowing",
    weekRef: 1,
    starterCode: `// printId should upper-case string ids and pad number ids to 6 digits.
// Make it compile with narrowing — no casts, no \`any\`.

function printId(id: string | number) {
  console.log(id.toUpperCase()); // ❌ not every id is a string
  console.log(id.toFixed(0).padStart(6, "0")); // ❌ not every id is a number
}

printId("abc-123");
printId(42);
`,
    hint: 'Branch with a type guard: if (typeof id === "string") { ...toUpperCase... } else { ...toFixed... }. Inside each branch, TypeScript narrows the union for you.',
  },
  {
    id: "exhaustive-shapes",
    title: "Exhaustive discriminated union",
    topic: "Discriminated unions & never",
    weekRef: 1,
    starterCode: `// 1. Implement area with a switch over shape.kind.
// 2. In the default branch, assign shape to a variable typed \`never\` —
//    so adding a fourth variant later becomes a compile error, not a bug.

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  return 0; // ❌ replace with an exhaustive switch
}

console.log(area({ kind: "circle", radius: 2 }).toFixed(2));
console.log(area({ kind: "square", side: 3 }));
console.log(area({ kind: "rectangle", width: 3, height: 4 }));
`,
    hint: "switch (shape.kind) { case \"circle\": return Math.PI * shape.radius ** 2; ... default: { const exhaustive: never = shape; return exhaustive; } }",
  },
  {
    id: "derive-typeof-keyof",
    title: "Derive, don't declare",
    topic: "typeof + keyof",
    weekRef: 2,
    starterCode: `// Style rule #1: one source of truth. Derive ThemeName from the palette
// object — delete the hand-written union so "sepia" starts compiling.

const palette = {
  light: { bg: "#ffffff", fg: "#09090b" },
  dark: { bg: "#09090b", fg: "#fafafa" },
  sepia: { bg: "#f1e7d0", fg: "#433422" },
};

type ThemeName = "light" | "dark"; // ❌ derive me instead

function themeFor(name: ThemeName) {
  return palette[name];
}

console.log(themeFor("sepia")); // ✅ once ThemeName is derived
`,
    hint: "type ThemeName = keyof typeof palette — now adding a theme to the object automatically widens the type.",
  },
  {
    id: "as-const-satisfies",
    title: "as const + satisfies",
    topic: "Validated config, literal types",
    weekRef: 2,
    starterCode: `// Style rule #7: satisfies for validated configs.
// 1. Append \`as const satisfies Record<string, Route>\` to routes
//    (it will reveal a bug — fix the bad path).
// 2. Derive RouteName from routes so go("home") type-checks.

type Route = { path: \`/\${string}\`; title: string };

const routes = {
  home: { path: "/", title: "Dashboard" },
  playground: { path: "playground", title: "Playground" },
};

type RouteName = string; // ❌ derive me

const go = (name: RouteName) => console.log("→", routes[name].path);

go("home");
go("playground");
`,
    hint: 'as const satisfies Record<string, Route> flags "playground" (missing leading slash) while keeping literal types. Then: type RouteName = keyof typeof routes.',
  },
  {
    id: "generic-pluck",
    title: "Implement a generic function",
    topic: "Type parameters & constraints",
    weekRef: 3,
    starterCode: `// Make pluck generic so both calls infer precise element types:
// pluck(users, "name") → string[]     pluck(users, "age") → number[]

function pluck(items, key) {
  return items.map((item) => item[key]);
}

const users = [
  { name: "Ada", age: 36 },
  { name: "Grace", age: 45 },
];

const names = pluck(users, "name");
console.log(names.map((n) => n.toUpperCase())); // n must be string
console.log(pluck(users, "age"));
`,
    hint: "function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] — K is constrained to T's keys, and the return type is an indexed access.",
  },
  {
    id: "template-literal-events",
    title: "Template literal types",
    topic: "String manipulation at the type level",
    weekRef: 3,
    starterCode: `// Derive EventName = "onClick" | "onHover" | "onFocus" from the tuple —
// no hand-written members allowed.

const interactions = ["click", "hover", "focus"] as const;

type Interaction = (typeof interactions)[number];

type EventName = never; // ❌ build me with a template literal type

const handlers: Record<EventName, () => void> = {
  onClick: () => console.log("clicked"),
  onHover: () => console.log("hovered"),
  onFocus: () => console.log("focused"),
};

handlers.onClick();
`,
    hint: "type EventName = `on${Capitalize<Interaction>}` — the template literal type distributes over the union, and Capitalize is a built-in intrinsic type.",
  },
  {
    id: "conditional-unwrap",
    title: "Conditional types + infer",
    topic: "Unwrapping container types",
    weekRef: 3,
    starterCode: `// Implement Unwrap so all three assertions compile:
//   Unwrap<Promise<string>> → string
//   Unwrap<string[]>        → string
//   Unwrap<number>          → number

type Unwrap<T> = T; // ❌ fix with conditional types + infer

// -- type-level test rig (leave as is) --------------------------------
type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type _t1 = Expect<Equal<Unwrap<Promise<string>>, string>>;
type _t2 = Expect<Equal<Unwrap<string[]>, string>>;
type _t3 = Expect<Equal<Unwrap<number>, number>>;

console.log("green types = solved");
`,
    hint: "type Unwrap<T> = T extends Promise<infer U> ? U : T extends readonly (infer U)[] ? U : T",
  },
  {
    id: "result-type",
    title: "Errors as values: Result",
    topic: "Result<T, E> & narrowing on ok",
    weekRef: 4,
    starterCode: `// Style rule #8: expected failures are values, not exceptions.
// Implement parseAge — it must never throw:
//   valid non-negative number → { ok: true, value }
//   anything else            → { ok: false, error }

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseAge(input: string): Result<number, string> {
  throw new Error("todo"); // ❌ implement me
}

for (const raw of ["42", "-1", "abc"]) {
  const result = parseAge(raw);
  if (result.ok) {
    console.log(raw, "→", result.value);
  } else {
    console.log(raw, "✗", result.error);
  }
}
`,
    hint: 'const n = Number(input); if (Number.isNaN(n)) return { ok: false, error: "not a number" }; if (n < 0) return { ok: false, error: "negative" }; return { ok: true, value: n };',
  },
  {
    id: "mapped-getters",
    title: "Write a mapped type",
    topic: "Mapped types + key remapping",
    weekRef: 3,
    starterCode: `// Derive Getters<T>: each property k of T becomes \`get\${Capitalize<k>}\`,
// a function returning T[k].

type User = { name: string; age: number };

type Getters<T> = never; // ❌ implement with a mapped type + \`as\` remapping

const userGetters: Getters<User> = {
  getName: () => "Ada",
  getAge: () => 36,
};

console.log(userGetters.getName(), userGetters.getAge());
`,
    hint: "type Getters<T> = { [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K] }",
  },
  {
    id: "branded-ids",
    title: "Branded types",
    topic: "Nominal typing over structural",
    weekRef: 4,
    starterCode: `// Two ids, both strings — structurally identical, semantically different.
// Brand them so the last call becomes a compile error, then delete it.

type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = string; // ❌ brand me
type PostId = string; // ❌ brand me

const userId = (raw: string): UserId => raw as UserId; // \`as\` is OK here:
const postId = (raw: string): PostId => raw as PostId; // the brand boundary.

function loadUser(id: UserId) {
  console.log("loading user", id);
}

loadUser(userId("u_1")); // ✅ stays fine
loadUser(postId("p_9")); // ❌ must error once branded
`,
    hint: 'type UserId = Brand<string, "UserId">; type PostId = Brand<string, "PostId"> — the phantom __brand property makes them incompatible.',
  },
  {
    id: "typed-event-map",
    title: "Typed event handlers",
    topic: "Generic handlers over an event map",
    weekRef: 6,
    starterCode: `// Type emit against the event map so payloads must match their event —
// the third call should become a compile error (qty is missing).

type EventMap = {
  "cart:add": { sku: string; qty: number };
  "cart:clear": undefined;
};

function emit(name, payload) {
  console.log("emit", name, payload ?? "");
}

emit("cart:add", { sku: "kbd-01", qty: 2 }); // ✅
emit("cart:clear", undefined); // ✅
emit("cart:add", { sku: "kbd-01" }); // ❌ should error: qty missing
`,
    hint: "function emit<K extends keyof EventMap>(name: K, payload: EventMap[K]) — K narrows to the literal event name, and the payload type follows via indexed access.",
  },
] as const satisfies readonly Drill[];

export type DrillId = (typeof drills)[number]["id"];
