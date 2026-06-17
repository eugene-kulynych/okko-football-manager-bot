import { Markup } from "telegraf";
import { Triggers } from "../types/triggers";
import { MyContext } from "../types/context";

const ADMINS = [349489768, 254813951];

export const onStart = async (ctx: MyContext): Promise<void> => {
  const currentUserId = ctx.message?.from?.id;
  if (!currentUserId) return;

  if (ADMINS.includes(currentUserId)) {
    const adminKeyboard = Markup.keyboard([
      [Triggers.createPoll, Triggers.createTeams],
      [Triggers.listOfPlayers],
    ]).resize();

    await ctx.reply("Welcome! You are an admin", adminKeyboard);
    return;
  }

  await ctx.reply("Привіт! Цей бот для адмінів групи ⚽");
};
