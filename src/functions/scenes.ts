import { Scenes } from "telegraf";
import { createTeamsScene } from "./createTeams";
import { sendMessageScene } from "./sendMessage";

export const stage = new Scenes.Stage([createTeamsScene, sendMessageScene]);
