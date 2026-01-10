import type { Bot } from "grammy";
import { setUserData, clearUserState } from "../state.js";
import { mainMenuKeyboard } from "../keyboards.js";

export function registerStatusAvailable(bot: Bot) {
  bot.callbackQuery("status_available", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch {}

    const rawId = ctx.from?.id;
    if (!rawId) return;
    const userId = String(rawId);

    setUserData(userId, { status: "available" });
    clearUserState(userId);

    await ctx.reply("Status set to Available.", {
      reply_markup: mainMenuKeyboard,
    });
  });
}
