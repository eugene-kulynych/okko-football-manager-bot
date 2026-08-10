import "dotenv/config";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { encryptPlayers } from "../src/helpers/playersCrypto";

const secret = process.env.PLAYERS_SECRET;
const input = process.env.PLAYERS_FILE || join(process.cwd(), "data/players.json");
const output =
  process.env.PLAYERS_ENC_FILE || join(process.cwd(), "data/players.enc");

if (!secret) {
  console.error("Set PLAYERS_SECRET in .env before encrypting");
  process.exit(1);
}

if (!existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

const plaintext = readFileSync(input, "utf-8");
JSON.parse(plaintext); // validate JSON

const payload = encryptPlayers(plaintext, secret);
writeFileSync(output, payload, "utf-8");
console.log(`Encrypted ${input} → ${output}`);
