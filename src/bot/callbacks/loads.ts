import type { Bot } from "grammy";
import { mainMenuKeyboard } from "../keyboards.js";

export function registerLoads(bot: Bot) {
  bot.callbackQuery("loads", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch {}

    // Placeholder: implement loads search logic here
    await ctx.reply("Looking for loads... (feature not implemented yet)", {
      reply_markup: mainMenuKeyboard,
    });
  });
}
