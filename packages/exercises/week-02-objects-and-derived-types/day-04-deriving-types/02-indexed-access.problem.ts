/**
 * Exercise 02 — Indexed access types
 *
 * A type that lives INSIDE another type doesn't need its own declaration —
 * reach in with indexed access: `Album["artist"]` is the artist's type, and
 * `Album["tracks"][number]` is one element of the tracks array. The
 * re-declarations below drifted: `country` went missing and a duration
 * became a string.
 *
 * 🎯 1. `type Artist = Album["artist"];`
 *    2. `type Track = Album["tracks"][number];`
 *    Don't touch `Album` or the function bodies.
 */
import { expect, expectTypeOf, it } from "vitest";

type Album = {
  title: string;
  artist: { name: string; country: string };
  tracks: { title: string; durationSeconds: number }[];
};

// Re-declared by hand — drifted (country is missing).
type Artist = { name: string };

// Re-declared by hand — drifted (durationSeconds became a string).
type Track = { title: string; durationSeconds: string };

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
