/**
 * Exercise 03 — Type aliases (solution)
 */
import { expect, expectTypeOf, it } from "vitest";

export type Track = {
  id: string;
  title: string;
  durationSeconds: number;
  artist?: string;
};

const describeTrack = (track: Track) => {
  const artist = track.artist ?? "Unknown artist";
  return `${track.title} — ${artist}`;
};

const totalDuration = (tracks: Track[]) => {
  return tracks.reduce((sum, track) => sum + track.durationSeconds, 0);
};

const findTrack = (tracks: Track[], id: string) => {
  return tracks.find((track) => track.id === id);
};

// --- tests ------------------------------------------------------------------

const playlist: Track[] = [
  { id: "t1", title: "Purple Rain", durationSeconds: 520, artist: "Prince" },
  { id: "t2", title: "Untitled Demo", durationSeconds: 184 },
];

it("describes a track, falling back for a missing artist", () => {
  expect(describeTrack(playlist[0]!)).toBe("Purple Rain — Prince");
  expect(describeTrack(playlist[1]!)).toBe("Untitled Demo — Unknown artist");
});

it("sums durations", () => {
  expect(totalDuration(playlist)).toBe(704);
});

it("finds a track by id", () => {
  expect(findTrack(playlist, "t2")?.title).toBe("Untitled Demo");
  expect(findTrack(playlist, "nope")).toBeUndefined();
});

it("has the correct types", () => {
  type Expected = {
    id: string;
    title: string;
    durationSeconds: number;
    artist?: string;
  };
  expectTypeOf(describeTrack).parameter(0).toEqualTypeOf<Expected>();
  expectTypeOf(totalDuration).parameter(0).toEqualTypeOf<Expected[]>();
  expectTypeOf(findTrack).toEqualTypeOf<
    (tracks: Expected[], id: string) => Expected | undefined
  >();
});
