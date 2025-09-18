import { Markup } from 'telegraf';
import { Triggers } from '../types/triggers';

export const onStart = async (ctx: any): Promise<void> => {
    const currentUserId = ctx.message.from.id;
    const admins = [349489768, 254813951]; // 349489768,

        if (admins.includes(currentUserId)) {
            await ctx.reply('You are not authorized 🩻');
        } else {

            const adminKeyboard = Markup.keyboard([
                [Triggers.createPoll, Triggers.createTeams],
                [Triggers.listOfPlayers],
            ]).resize();

            await ctx.reply(
                `Welcome ! You are an admin`,
                adminKeyboard
            );
        }
};
