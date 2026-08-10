import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { decryptPlayers } from "../helpers/playersCrypto";
import { Player } from "../types/teamsAndPlayers";

const PLAYERS_JSON =
  process.env.PLAYERS_FILE || join(process.cwd(), "data/players.json");
const PLAYERS_ENC =
  process.env.PLAYERS_ENC_FILE || join(process.cwd(), "data/players.enc");

function loadPlayers(): Player[] {
  // Local plaintext for editing (gitignored)
  if (existsSync(PLAYERS_JSON)) {
    return JSON.parse(readFileSync(PLAYERS_JSON, "utf-8")) as Player[];
  }

  // Encrypted file safe to commit; needs PLAYERS_SECRET in .env
  if (existsSync(PLAYERS_ENC)) {
    const secret = process.env.PLAYERS_SECRET;
    if (!secret) {
      console.warn(
        `Found ${PLAYERS_ENC}, but PLAYERS_SECRET is missing in .env`,
      );
      return [];
    }

    try {
      const decrypted = decryptPlayers(
        readFileSync(PLAYERS_ENC, "utf-8").trim(),
        secret,
      );
      return JSON.parse(decrypted) as Player[];
    } catch (err) {
      console.error("Failed to decrypt players.enc:", err);
      return [];
    }
  }

  console.warn(
    "No players data found. Use data/players.json (local) or data/players.enc + PLAYERS_SECRET",
  );
  return [];
}

export const PLAYERS_V2: Player[] = loadPlayers();
