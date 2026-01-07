import type { Bot } from "grammy";
import { mainMenuKeyboard } from "../keyboards.js";

export function registerHelp(bot: Bot) {
  bot.callbackQuery("help", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch {}

    await ctx.reply(
      "Help section:\n- Use /start to begin registration\n- Use /menu to open main menu\nIf you need more assistance, contact @JonasMikkelsen",
      { reply_markup: mainMenuKeyboard }
    );
  });
}
