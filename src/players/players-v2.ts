import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Player } from "../types/teamsAndPlayers";

const PLAYERS_FILE =
  process.env.PLAYERS_FILE || join(process.cwd(), "data/players.json");

function loadPlayers(): Player[] {
  if (!existsSync(PLAYERS_FILE)) {
    console.warn(
      `Players file not found: ${PLAYERS_FILE}. ` +
        "Copy data/players.example.json to data/players.json",
    );
    return [];
  }

  const raw = readFileSync(PLAYERS_FILE, "utf-8");
  return JSON.parse(raw) as Player[];
}

export const PLAYERS_V2: Player[] = loadPlayers();
