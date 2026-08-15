/**
 * Exercise 02 — useRef needs an initial value (React 19)
 *
 * React 19's types removed the zero-argument `useRef()` overload — every ref
 * starts from an explicit initial value. The three flavors:
 *   - DOM refs:      useRef<HTMLDivElement>(null)  → RefObject<HTMLDivElement | null>
 *   - mutable box:   useRef(0)                     → RefObject<number>
 *   - "not yet" box: useRef<number | null>(null)   → RefObject<number | null>
 *
 * 🎯 Give every `useRef` below an initial value that matches how the ref is
 *    used in the body. Don't change the body.
 */
import type { RefObject } from "react";
import { useRef, useState } from "react";
import { expect, expectTypeOf, it } from "vitest";

const formatElapsed = (ms: number): string => `${(ms / 1000).toFixed(1)}s`;

const Stopwatch = () => {
  const intervalId = useRef<ReturnType<typeof setInterval>>();
  const startedAt = useRef<number>();
  const rootRef = useRef<HTMLDivElement>();
  const renderCount = useRef<number>();
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
