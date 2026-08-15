/**
 * Exercise 01 — Discriminated union props
 *
 * When props depend on each other ("error banners MUST offer retry, loading
 * banners take nothing else"), one object type with optional props can't say
 * that: it makes illegal combinations representable and forces defensive
 * checks for states that can't happen — see the two errors in the body.
 * A union of prop objects discriminated on `status` makes the compiler
 * enforce the rules at every call site instead.
 *
 * 🎯 Replace `BannerProps` with a union discriminated on `status`:
 *    loading (nothing else) · success (message) · error (message + onRetry).
 *    The body doesn't change — watch its errors disappear once the type
 *    tells the truth.
 */
import { expect, it } from "vitest";

type BannerProps = {
  status: "loading" | "success" | "error";
  message?: string;
  onRetry?: () => void;
};

const Banner = (props: BannerProps) => {
  switch (props.status) {
    case "loading":
      return <div className="banner">Loading…</div>;
    case "success":
      return <div className="banner banner-ok">{props.message}</div>;
    case "error":
      return (
        <div className="banner banner-err" role="alert">
          {props.message}
          <button onClick={() => props.onRetry()}>Retry</button>
        </div>
      );
    default: {
      const unhandled: never = props;
      return unhandled;
    }
  }
};

// --- tests ------------------------------------------------------------------

it("renders each state", () => {
  expect(Banner({ status: "loading" }).props.className).toBe("banner");
  expect(Banner({ status: "success", message: "Saved!" }).props.children).toBe("Saved!");
  const err = Banner({ status: "error", message: "Boom", onRetry: () => {} });
  expect(err.props.className).toBe("banner banner-err");
  expect(err.props.role).toBe("alert");
});

it("invalid prop combinations do not compile", () => {
  <Banner status="loading" />;
  <Banner status="success" message="Done" />;
  <Banner status="error" message="Nope" onRetry={() => {}} />;
  // @ts-expect-error loading banners take no message
  <Banner status="loading" message="hold on" />;
  // @ts-expect-error success banners never offer retry
  <Banner status="success" message="Done" onRetry={() => {}} />;
  // @ts-expect-error error banners must provide onRetry
  <Banner status="error" message="Nope" />;
});
