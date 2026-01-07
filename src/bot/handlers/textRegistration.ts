// === src/bot/handlers/textRegistration.ts ===

import type { Bot } from "grammy";
import {
  getUserState,
  setUserData,
  setUserState,
  clearUserState,
} from "../state.js";
import { mainMenuKeyboard } from "../keyboards.js";

export function registerTextRegistration(bot: Bot) {
  bot.on("message:text", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const state = getUserState(userId);
    const text = ctx.message.text?.trim();

    if (!text) {
      await ctx.reply("Please send text.");
      return;
    }

    // — Awaiting full name
    if (state === "awaiting_name") {
      // — Basic validation: require at least two words
      if (text.split(/\s+/).length < 2) {
        await ctx.reply("Please enter your full name (first and last name).");
        return;
      }

      setUserData(userId, { name: text });
      setUserState(userId, "awaiting_unit");

      await ctx.reply(`Thank you, ${text}! Now enter your unit number:`);
      return;
    }

    // — Awaiting unit
    if (state === "awaiting_unit") {
      if (text.length < 1) {
        await ctx.reply("Please enter a valid unit number.");
        return;
      }

      setUserData(userId, { unit: text });
      // — Registration finished: clear state but keep userData
      clearUserState(userId);

      await ctx.reply("Thanks! Registration complete.");
      await ctx.reply("Please choose an option:", {
        reply_markup: mainMenuKeyboard,
      });
      return;
    }

    // — Not in registration flow
    await ctx.reply(
      "If you want to register, press /start and follow the steps."
    );
  });
}
