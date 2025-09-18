import { Scenes } from 'telegraf';
import {createTeamsScene } from "./createTeams";

export const stage = new Scenes.Stage([createTeamsScene]);
