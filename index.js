require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const {
  extractFile,
  startConversionJob,
  getConvertedFile,
  indentifySong,
  buildResponseMessage,
} = require("./extras/utils");

const { TELEGRAM_BOT_TOKEN } = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const { id: chatId } = msg.chat;

  if (msg.voice) {
    try {
      await bot.sendMessage(chatId, "Audio received! Processing... 🎧");

      const filePath = await extractFile(msg);
      const jobId = await startConversionJob(filePath);
      const url = await getConvertedFile(jobId);
      const songData = await indentifySong(url);

      if (!songData) {
        await bot.sendMessage(chatId, "I couldn't find any similar song. 🙁");

        return;
      }

      const res = await buildResponseMessage(songData);

      await bot.sendMessage(chatId, res, { parse_mode: "Markdown" });
    } catch (e) {
      bot.sendMessage(
        chatId,
        "Sorry, something went wrong with the request. Please try again later! 🤒"
      );
    }

    return;
  }

  if (msg.text === "/start") {
    bot.sendMessage(
      chatId,
      dedent`
        Hi, ${msg.from.first_name}! Welcome to the Sound Bot. 😁

        Record any currently playing song. I'll listen to it, and look up as much information as possible about it! 🎵
      `
    );

    return;
  }

  bot.sendMessage(chatId, "Sorry, I can only handle audio files! 🔊");
});
