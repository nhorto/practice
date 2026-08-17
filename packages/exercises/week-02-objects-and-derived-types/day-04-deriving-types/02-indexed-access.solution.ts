/**
 * Exercise 02 — Indexed access types (solution)
 *
 * `Album["artist"]` and `Album["tracks"][number]` reach into the source
 * type, so renaming or reshaping `Album` updates every consumer — no copies
 * to chase down.
 */
import { expect, expectTypeOf, it } from "vitest";

type Album = {
  title: string;
  artist: { name: string; country: string };
  tracks: { title: string; durationSeconds: number }[];
};

type Artist = Album["artist"];

type Track = Album["tracks"][number];

const formatArtist = (artist: Artist): string => {
  return `${artist.name} (${artist.country})`;
};

const totalDuration = (tracks: Track[]): number => {
  return tracks.reduce((sum, track) => sum + track.durationSeconds, 0);
};

// --- tests ------------------------------------------------------------------

const album: Album = {
  title: "Kind of Blue",
  artist: { name: "Miles Davis", country: "US" },
  tracks: [
    { title: "So What", durationSeconds: 545 },
    { title: "Blue in Green", durationSeconds: 337 },
  ],
};

it("derives the nested types from Album", () => {
  expectTypeOf<Artist>().toEqualTypeOf<Album["artist"]>();
  expectTypeOf<Track>().toEqualTypeOf<Album["tracks"][number]>();
});

it("formats the album's artist", () => {
  expect(formatArtist(album.artist)).toBe("Miles Davis (US)");
});

it("sums the album's track durations", () => {
  expect(totalDuration(album.tracks)).toBe(882);
});
