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

    const rawId = ctx.from?.id;
    if (!rawId) return;
    const userId = String(rawId);

    setUserState(userId, "awaiting_status");

    await ctx.reply("Set your status:", {
      reply_markup: statusKeyboard,
    });
  });
}
