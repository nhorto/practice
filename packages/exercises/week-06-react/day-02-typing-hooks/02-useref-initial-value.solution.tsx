/**
 * Exercise 02 — useRef needs an initial value (React 19) (solution)
 *
 * Every ref declares its full lifetime up front:
 *   - `useRef<ReturnType<typeof setInterval> | null>(null)` — a handle we set and clear
 *   - `useRef<number | null>(null)` — a timestamp that starts absent
 *   - `useRef<HTMLDivElement>(null)` — DOM refs get `| null` added by React's types
 *   - `useRef(0)` — plain mutable box, fully inferred
 */
import type { RefObject } from "react";
import { useRef, useState } from "react";
import { expect, expectTypeOf, it } from "vitest";

const formatElapsed = (ms: number): string => `${(ms / 1000).toFixed(1)}s`;

const Stopwatch = () => {
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const renderCount = useRef(0);
  const [elapsed, setElapsed] = useState(0);

  renderCount.current += 1;

  const start = () => {
    startedAt.current = Date.now();
    intervalId.current = setInterval(() => {
      if (startedAt.current !== null) {
        setElapsed(Date.now() - startedAt.current);
      }
    }, 100);
  };

  const stop = () => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    startedAt.current = null;
  };

  // Checked at compile time — the component is never invoked.
  expectTypeOf(rootRef).toEqualTypeOf<RefObject<HTMLDivElement | null>>();
  expectTypeOf(startedAt.current).toEqualTypeOf<number | null>();
  expectTypeOf(renderCount.current).toEqualTypeOf<number>();

  return (
    <div ref={rootRef} className="stopwatch">
      {formatElapsed(elapsed)}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
};

// --- tests ------------------------------------------------------------------

it("formats milliseconds", () => {
  expect(formatElapsed(0)).toBe("0.0s");
  expect(formatElapsed(2500)).toBe("2.5s");
});

it("the component constructs", () => {
  const element = <Stopwatch />;
  expect(element.type).toBe(Stopwatch);
});
