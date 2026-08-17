/**
 * Exercise 02 — Context with a null-safe consumer hook
 *
 * `createContext` demands a default value. For "there is no sensible
 * default — a provider is required" data, store `Theme | null` and hide the
 * null behind a custom hook that throws when no provider is above. Every
 * consumer then gets a guaranteed `Theme`; nobody null-checks a value that
 * can't be null in a correct tree.
 *
 * 🎯 Make `useTheme` guard against `null` (throw a helpful error) and
 *    annotate its return type as `Theme`. The consumer below should then
 *    compile as-is.
 */
import type { Context, ReactNode } from "react";
import { createContext, useContext } from "react";
import { expect, expectTypeOf, it } from "vitest";

type Theme = { name: "light" | "dark"; accent: string };

const ThemeContext = createContext<Theme | null>(null);

const useTheme = () => useContext(ThemeContext);

// React 19: the Context object doubles as its own provider component.
const ThemeProvider = ({ theme, children }: { theme: Theme; children: ReactNode }) => (
  <ThemeContext value={theme}>{children}</ThemeContext>
);

const ThemedBadge = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <span className={`badge badge-${theme.name}`} style={{ color: theme.accent }}>
      {children}
    </span>
  );
};

// --- tests ------------------------------------------------------------------

const midnight: Theme = { name: "dark", accent: "#7aa2f7" };

it("consumers receive a guaranteed Theme, never null", () => {
  expectTypeOf(useTheme).returns.toEqualTypeOf<Theme>();
});

it("the context itself stays nullable — no fake default object", () => {
  expectTypeOf(ThemeContext).toEqualTypeOf<Context<Theme | null>>();
});

it("the provider element is the context object itself (React 19)", () => {
  const element = ThemeProvider({ theme: midnight, children: "hello" });
  expect(element.type).toBe(ThemeContext);
  expect(element.props.value).toBe(midnight);
  expect(element.props.children).toBe("hello");
});

it("the consumer component constructs", () => {
  const element = <ThemedBadge>beta</ThemedBadge>;
  expect(element.type).toBe(ThemedBadge);
  expect(element.props.children).toBe("beta");
});
