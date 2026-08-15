/**
 * Exercise 02 — Context with a null-safe consumer hook (solution)
 *
 * The null lives in exactly one place: the context. `useTheme` throws when
 * the provider is missing — a loud, immediate error at development time —
 * and its `Theme` return type means no consumer ever writes `theme?.accent`
 * for a state that can't happen in a correct tree.
 */
import type { Context, ReactNode } from "react";
import { createContext, useContext } from "react";
import { expect, expectTypeOf, it } from "vitest";

type Theme = { name: "light" | "dark"; accent: string };

const ThemeContext = createContext<Theme | null>(null);

const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error("useTheme must be used inside a <ThemeProvider>");
  }
  return theme;
};

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
