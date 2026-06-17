import { Composer, Scenes } from "telegraf";
import { MyContext } from "../types/context";
import { message } from "telegraf/filters";
import { divideIntoTeams } from "../helpers/divideIntoTeams";
import { generateOkkoTeamName } from "../helpers/generateRandomTeamName";
import { balanceTeamsByAverage } from "../helpers/balanceTeams";

const start = new Composer<MyContext>();
// const teamsAmount = new Composer<MyContext>();
const finish = new Composer<MyContext>();

start.on(message("text"), async (ctx: any) => {
  ctx.session.wizardSessionData ??= {};

  const responseText = `Введіть кількість команд\nНаприклад: 3
        `;
  await ctx.reply(responseText);
  return ctx.wizard.next();
});

// teamsAmount.on(message('text'), async (ctx: any) => {
//     const teamCount = Number(ctx.message.text);
//     ctx.session.wizardSessionData.teamCount = teamCount;
//
//     const responseText =
//         `Введіть кількість гравців в команді\nНаприклад: 5
//         `;
//     await ctx.reply(responseText);
//     return ctx.wizard.next();
// })

finish.on(message("text"), async (ctx: any) => {
  const teamCount = Number(ctx.message.text);
  ctx.session.wizardSessionData.teamCount = teamCount;
  // ctx.session.wizardSessionData.playersCount = playersCount;

  const responseText = `Кількість команд: ${teamCount}`;
  await ctx.reply(responseText);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  await ctx.reply("Ділимо на команди ...");

  const [keepers, fieldPlayers] = ctx.scene.state.players;

  const res = balanceTeamsByAverage(keepers, fieldPlayers, teamCount);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const usedNames = new Set<string>();

  let message = "";

  const team = res.teams;
  const imbalance = res.imbalance;

  const response = `Teams: ${JSON.stringify(team)}, Imbalance: ${imbalance}`;

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
  // teamsAmount,
  finish,
);
