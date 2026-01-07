import type { Bot } from "grammy";
import { mainMenuKeyboard } from "../keyboards.js";

export function registerMainMenu(bot: Bot) {
  bot.callbackQuery("main_menu", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch {}

    await ctx.reply("Please choose an option:", {
      reply_markup: mainMenuKeyboard,
    });
  });
}
