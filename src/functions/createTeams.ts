import { Composer, Scenes } from "telegraf";
import { MyContext } from "../types/context";
import { message } from "telegraf/filters";
import { generateOkkoTeamName } from "../helpers/generateRandomTeamName";
import { balanceTeamsByAverage } from "../helpers/balanceTeams";

const start = new Composer<MyContext>();
const finish = new Composer<MyContext>();

start.on(message("text"), async (ctx: any) => {
  const responseText = `Введіть кількість команд\nНаприклад: 3
        `;
  await ctx.reply(responseText);
  return ctx.wizard.next();
});

finish.on(message("text"), async (ctx: any) => {
  const teamCount = Number(ctx.message.text);

  const responseText = `Кількість команд: ${teamCount}`;
  await ctx.reply(responseText);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  await ctx.reply("Ділимо на команди ...");

  const [keepers, fieldPlayers] = ctx.scene.state.players;

  const res = balanceTeamsByAverage(keepers, fieldPlayers, teamCount);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const usedNames = new Set<string>();

  let message = "";

  res.teams.forEach((team, idx) => {
    const teamName = generateOkkoTeamName(usedNames);

    message += `🏆 Команда ${idx + 1}: ${teamName}\n`;
    message += `⭐ Сила команди: ${team.avgRating.toFixed(2)}\n\n`;

    const goalkeepers = team.players.filter((p) => p.role === "GK");
    const fieldPlayers = team.players
      .filter((p) => p.role !== "GK")
      .sort(() => Math.random() - 0.5);

    const orderedPlayers = [...goalkeepers, ...fieldPlayers];

    orderedPlayers.forEach((player, i) => {
      const name =
        player.firstName && player.lastName
          ? `${player.firstName} ${player.lastName}`
          : player.nickname || "Unknown";

      const role = player.role === "GK" ? "🧤" : "🏃‍";

      message += `  ${i + 1}. ${role} ${name}\n`;
    });

    message += "\n➖➖➖➖➖➖➖➖➖➖\n\n";
  });

  await ctx.reply("Готово!");
  await ctx.telegram.sendMessage(process.env.CHAT_ID, message);
  return await ctx.scene.leave();
});

export const createTeamsScene = new Scenes.WizardScene<MyContext>(
  "createTeams",
  start,
  finish,
);
