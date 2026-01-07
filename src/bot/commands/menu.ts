import type { Bot } from "grammy";
import { mainMenuKeyboard } from "../keyboards.js";

export function registerMenu(bot: Bot) {
  bot.command("menu", async (ctx) => {
    await ctx.reply("Please choose an option:", {
      reply_markup: mainMenuKeyboard,
    });
  });
}
