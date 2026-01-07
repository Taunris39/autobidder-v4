// === src/bot/callbacks/agree.ts

import type { Bot } from "grammy";
import { setUserState, setUserData } from "../state.js";

export function registerAgree(bot: Bot) {
  bot.callbackQuery("agree", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.warn("deleteMessage failed:", err);
    }

    const userId = ctx.from?.id;
    if (!userId) return;

    setUserState(userId, "awaiting_name");
    setUserData(userId, {}); // initialize profile

    await ctx.reply(
      "Great! You have successfully agreed to the terms.\n\nPlease enter your full name:"
    );
  });
}
