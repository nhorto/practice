/**
 * Exercise 01 — Discriminated union props (solution)
 *
 * Each union member describes one legal shape, discriminated on `status`.
 * Inside the `switch`, `props` narrows to the matching member — so
 * `props.onRetry` is a guaranteed function in the error branch, and the
 * `never` default proves every status is handled.
 */
import { expect, it } from "vitest";

type BannerProps =
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; onRetry: () => void };

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
