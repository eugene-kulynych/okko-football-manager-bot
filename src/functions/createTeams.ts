import { Composer, Scenes } from "telegraf";
import { MyContext } from "../types/context";
import { message } from "telegraf/filters";
import { divideIntoTeams } from "../helpers/divideIntoTeams";
import { generateOkkoTeamName } from "../helpers/generateRandomTeamName";

const start = new Composer<MyContext>();
const teamsAmount = new Composer<MyContext>();
const finish = new Composer<MyContext>();

start.on(message('text'), async (ctx: any) => {
    ctx.session.wizardSessionData ??= {};

    const responseText =
        `Введіть кількість команд\nНаприклад: 3
        `;
    await ctx.reply(responseText);
    return ctx.wizard.next();
})

teamsAmount.on(message('text'), async (ctx: any) => {
    const teamCount = Number(ctx.message.text);
    ctx.session.wizardSessionData.teamCount = teamCount;

    const responseText =
        `Введіть кількість гравців в команді\nНаприклад: 5
        `;
    await ctx.reply(responseText);
    return ctx.wizard.next();
})

finish.on(message('text'), async (ctx: any) => {
    const playersCount = Number(ctx.message.text);
    ctx.session.wizardSessionData.playersCount = playersCount;

    const responseText =
        `Кількість команд: ${ctx.session.wizardSessionData.teamCount}\nКількість гравців в команді: ${ctx.session.wizardSessionData.playersCount}`;
    await ctx.reply(responseText);

    await new Promise(resolve => setTimeout(resolve, 1000));
    await ctx.reply('Ділимо на команди ...');

    const result = divideIntoTeams(ctx.scene.state.players, { numTeams: ctx.session.wizardSessionData.teamCount, maxPlayersPerTeam: ctx.session.wizardSessionData.playersCount });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const usedNames = new Set<string>();

    let message = "📋 *Розподіл по командах:*\n\n";

    result.forEach((team, idx) => {
        const teamName = generateOkkoTeamName(usedNames);
        message += `Команда: ${teamName}\n`;
        team.players.sort(() => Math.random() - 0.5).forEach((player, i) => {
            const name = player.firstName && player.lastName ? player.firstName + ' ' + player.lastName : player.nickname;
            message += `  ${i + 1}. ${name}\n`;
        });
        message += "\n";
    });

    await ctx.reply('Готово!');
    await ctx.telegram.sendMessage(process.env.CHAT_ID, message);
    return await ctx.scene.leave();
})


export const createTeamsScene = new Scenes.WizardScene<MyContext>(
    'createTeams',
    start,
    teamsAmount,
    finish,
);
