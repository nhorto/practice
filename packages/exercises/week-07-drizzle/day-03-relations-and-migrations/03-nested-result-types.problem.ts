/**
 * Exercise 03 — Derive nested result types from the query
 *
 * A relational query with `columns:` narrowing produces a very specific
 * shape — NOT the full row types. Someone hand-wrote `TeamCard` from the
 * full tables, and it's wrong twice over: the query only selects a few
 * columns of each player, and hand-written types drift the moment the query
 * changes.
 *
 * NOTE: `db` is type-only; `getTeamCards` is never called at runtime. The
 * `formatTeamCard` helper IS called — with plain objects, no db needed.
 *
 * 🎯 Replace the hand-written `TeamCard` with a type derived from the query:
 *    `Awaited<ReturnType<typeof getTeamCards>>[number]`.
 */
import { expect, expectTypeOf, it } from "vitest";
import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  region: text("region").notNull(),
});

export const players = sqliteTable("players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gamertag: text("gamertag").notNull(),
  role: text("role", { enum: ["tank", "dps", "support"] }).notNull(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
}));
export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, { fields: [players.teamId], references: [teams.id] }),
}));

export type Player = typeof players.$inferSelect;

const schema = { teams, players, teamsRelations, playersRelations };
declare const db: BetterSQLite3Database<typeof schema>;

const getTeamCards = () =>
  db.query.teams.findMany({
    columns: { id: true, name: true },
    with: { players: { columns: { id: true, gamertag: true } } },
  });

// ❌ hand-written from the full tables — the query selects less than this.
export type TeamCard = {
  id: number;
  name: string;
  players: Player[];
};

const formatTeamCard = (card: TeamCard) =>
  `${card.name} — ${card.players.map((p) => p.gamertag).join(", ")}`;

// --- tests ------------------------------------------------------------------

it("TeamCard mirrors exactly what the query selects", () => {
  expectTypeOf<TeamCard>().toEqualTypeOf<{
    id: number;
    name: string;
    players: { id: number; gamertag: string }[];
  }>();
});

it("formats a card built from the narrowed rows", () => {
  const card: TeamCard = {
    id: 1,
    name: "Nightowls",
    players: [
      { id: 7, gamertag: "moth" },
      { id: 8, gamertag: "lumen" },
    ],
  };
  expect(formatTeamCard(card)).toBe("Nightowls — moth, lumen");
});
