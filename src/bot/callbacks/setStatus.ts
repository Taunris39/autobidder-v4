import type { Bot } from "grammy";
import { setUserState } from "../state.js";
import { statusKeyboard } from "../keyboards.js";

export function registerSetStatus(bot: Bot) {
  bot.callbackQuery("set_status", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch {}

    const userId = ctx.from?.id;
    if (!userId) return;

    setUserState(userId, "awaiting_status");

    await ctx.reply("Set your status:", {
      reply_markup: statusKeyboard,
    });
  });
}
