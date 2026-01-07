import type { Bot } from "grammy";
import { setUserState } from "../state.js";

export function registerSetLocation(bot: Bot) {
  bot.callbackQuery("set_location", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch {}

    const userId = ctx.from?.id;
    if (!userId) return;

    setUserState(userId, "awaiting_location");

    const keyboard = {
      keyboard: [[{ text: "Send location", request_location: true }]],
      one_time_keyboard: true,
      resize_keyboard: true,
    };

    await ctx.reply("Please send your location using the button below.", {
      reply_markup: keyboard,
    });
  });
}
