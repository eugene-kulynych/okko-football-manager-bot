import "dotenv/config";
import { session, Telegraf } from "telegraf";
import { onStart } from "./functions/start";
import { stage } from "./functions/scenes";
import { MyContext } from "./types/context";
import { Triggers } from "./types/triggers";
import { PollAnswers, PollStorage } from "./types/teamsAndPlayers";
import { PLAYERS_V2 } from "./players/players-v2";

const port = process.env.PORT || 8000;
const token = process.env.TOKEN;


const main = async () => {
  const bot = new Telegraf<MyContext>(token);

  // bot.use(Telegraf.log());
  bot.use(session());
  bot.use(stage.middleware());
  bot.start(onStart);

  const pollStorage: PollStorage = {};
  let currentPollId: string | null = null;

  bot.hears(Triggers.createPoll, async (ctx: MyContext) => {
    const pollMsg = await ctx.telegram.sendPoll(
      process.env.CHAT_ID,
      "⚽⚽⚽ ФУТБОЛ ⚽⚽⚽",
      ["Буду (гравець) 🏃‍♂️", "Буду (кіпер) 🧤", "Не буду 💅️"],
      {
        is_anonymous: false,
        allows_multiple_answers: false,
      },
    );
    // const pollMsg = await ctx.telegram.sendPoll(
    //     process.env.CHAT_ID,
    //     "⚽⚽⚽ ФУТБОЛ (TEST) ⚽⚽⚽",
    //     ["Буду (гравець) 🏃‍♂️", "Буду (кіпер) 🧤", "Не буду 💅️"],
    //     {
    //       is_anonymous: false,
    //       allows_multiple_answers: false,
    //     },
    // );
    // const pollMsg = await ctx.telegram.sendPoll(
    //     process.env.CHAT_ID,
    //     "Оновлення даних Окко Футбол+",
    //     ["Оновити дані тут", "Оновити дані тут"],
    //     {
    //       is_anonymous: false,
    //       allows_multiple_answers: false,
    //     },
    // );
    currentPollId = pollMsg.poll.id;

    // Ініціалізуємо збереження по pollId
    pollStorage[pollMsg.poll.id] = {
      question: "Тест опитування",
      answers: [],
    };
  });

  bot.on("poll_answer", async (ctx) => {
    const { poll_id, user, option_ids } = ctx.update.poll_answer;

    if (!pollStorage[poll_id]) return;

    // Видалимо стару відповідь юзера, якщо є
    pollStorage[poll_id].answers = pollStorage[poll_id].answers.filter(
      (a) => a.userId !== user.id,
    );

    // Додаємо нову
    pollStorage[poll_id].answers.push({
      userId: user.id,
      username: user.username ?? "",
      fullName: `${user.first_name ?? ""} ${user.last_name ?? ""}`,
      optionIds: option_ids,
    });

    console.log("Оновлений список голосуючих:", pollStorage[poll_id].answers);
    const positive = pollStorage[poll_id].answers.filter((answer) => {
      return answer.optionIds[0] === 0;
    });
    const negative = pollStorage[poll_id].answers.filter((answer) => {
      return answer.optionIds[0] > 0;
    });

    const getListOfUsers = (arr: PollAnswers): string[] => {
      return arr.map((user) => {
        return user.fullName.trim() || user.username.trim();
      });
    };

    const listOfPositiveUsers = getListOfUsers(positive);
    const listOfNegativeUsers = getListOfUsers(negative);

    // await ctx.telegram.sendMessage(process.env.TEST_CHAT_ID,`За:  ${JSON.stringify(listOfPositiveUsers)}`);
    // await ctx.telegram.sendMessage(process.env.TEST_CHAT_ID,`Проти:  ${JSON.stringify(listOfNegativeUsers)}`);
  });

  bot.hears(Triggers.listOfPlayers, async (ctx) => {
    const pollId = currentPollId;
    if (!pollId) {
      return ctx.reply("Поки немає голосувань.");
    }

    const poll = pollStorage[pollId];
    if (!poll) {
      return ctx.reply("Голосування не знайдено. Створи новий poll.");
    }

    const answers = poll.answers;

    const playersYes = answers.filter(
      (answer) => answer.optionIds.includes(0) || answer.optionIds.includes(1),
    );
    const playersNo = answers.filter((answer) => answer.optionIds.includes(2));

    const formatPlayers = (players: typeof answers) => {
      if (players.length === 0) return "Немає голосів.";
      return players
        .map(
          (p) =>
            `${p.fullName ? p.fullName + " (" + p.username + ")" : p.username}`,
        )
        .join("\n");
    };

    const message =
      `Гравці "За":\n${formatPlayers(playersYes)}\n\n` +
      `Гравці "Проти":\n${formatPlayers(playersNo)}`;

    await ctx.reply(message);
  });

  bot.hears(Triggers.createTeams, async (ctx) => {
    if (!currentPollId) {
      return ctx.reply("Спочатку створи poll.");
    }

    const poll = pollStorage[currentPollId];
    if (!poll) {
      return ctx.reply("Голосування не знайдено. Створи новий poll.");
    }

    const answers = poll.answers;
    if (answers.length === 0) {
      return ctx.reply("Поки ніхто не проголосував.");
    }

    const fieldPlayers = answers.filter((answer) =>
      answer.optionIds.includes(0),
    );
    const goalKeepers = answers.filter((answer) =>
      answer.optionIds.includes(1),
    );

    // const votedIdYes = answers.filter((answer) => answer.optionIds.includes(0));

    const arrayOfKeepers = goalKeepers.map((player) => {
      const gk = PLAYERS_V2.find(
        (gk) => String(gk.userId) === String(player.userId),
      );
      if (gk) return gk;

      return {
        userId: player.userId,
        username: "",
        nickname: player.username || player.fullName,
        firstName: "",
        lastName: "",
        rating: 2,
      };
    });

    const arrayOfFieldPlayers = fieldPlayers.map((user) => {
      const player = PLAYERS_V2.find(
        (p) => String(p.userId) === String(user.userId),
      );

      if (player) return player;

      // Якщо гравця нема — створюємо новий об'єкт
      return {
        userId: String(user.userId),
        username: "",
        nickname: user.username || user.fullName,
        firstName: "",
        lastName: "",
        rating: 2,
      };
    });

    await ctx.scene.enter("createTeams", {
      players: [arrayOfKeepers, arrayOfFieldPlayers],
    });
  });

  bot.catch((err) => {
    const code = (err as { response?: { error_code?: number } }).response
      ?.error_code;
    if (code === 403) {
      console.warn("Telegram 403: bot blocked or forbidden to send message");
      return;
    }
    console.error("Unhandled bot error:", err);
  });

  await bot.launch();
  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};

main().catch((err) => {
  console.error("Failed to start bot:", err);
  process.exit(1);
});
