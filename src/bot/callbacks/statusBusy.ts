import type { Bot } from "grammy";
import { setUserData, clearUserState } from "../state.js";
import { mainMenuKeyboard } from "../keyboards.js";

export function registerStatusBusy(bot: Bot) {
  bot.callbackQuery("status_busy", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch {}

    const userId = ctx.from?.id;
    if (!userId) return;

    setUserData(userId, { status: "busy" });
    clearUserState(userId);

    await ctx.reply("Status set to Busy.", {
      reply_markup: mainMenuKeyboard,
    });
  });
}
