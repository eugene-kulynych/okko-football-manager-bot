import { Composer, Markup, Scenes } from "telegraf";
import { MyContext } from "../types/context";

const CANCEL = "/cancel";

const start = new Composer<MyContext>();
const preview = new Composer<MyContext>();
const confirm = new Composer<MyContext>();

start.use(async (ctx: any) => {
  await ctx.reply(
    `Надішли повідомлення для групи (текст, фото, відео, файл...)\nДля скасування: ${CANCEL}`,
  );
  return ctx.wizard.next();
});

preview.use(async (ctx: any) => {
  if (!ctx.message) return;

  if (ctx.message.text === CANCEL) {
    await ctx.reply("Скасовано.");
    return ctx.scene.leave();
  }

  ctx.wizard.state.messageId = ctx.message.message_id;

  // Показуємо адміну, як повідомлення виглядатиме в групі
  await ctx.telegram.copyMessage(
    ctx.chat.id,
    ctx.chat.id,
    ctx.message.message_id,
  );
  await ctx.reply(
    "Надіслати в групу?",
    Markup.inlineKeyboard([
      Markup.button.callback("✅ Надіслати", "sendMessage:send"),
      Markup.button.callback("❌ Скасувати", "sendMessage:cancel"),
    ]),
  );
  return ctx.wizard.next();
});

confirm.action("sendMessage:send", async (ctx: any) => {
  await ctx.answerCbQuery();
  await ctx.telegram.copyMessage(
    process.env.CHAT_ID,
    ctx.chat.id,
    ctx.wizard.state.messageId,
  );
  await ctx.editMessageText("Надіслано ✅");
  return ctx.scene.leave();
});

confirm.action("sendMessage:cancel", async (ctx: any) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText("Скасовано.");
  return ctx.scene.leave();
});

confirm.on("message", async (ctx: any) => {
  await ctx.reply("Натисни кнопку ✅ або ❌ під повідомленням вище.");
});

export const sendMessageScene = new Scenes.WizardScene<MyContext>(
  "sendMessage",
  start,
  preview,
  confirm,
);
