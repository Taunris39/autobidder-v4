// === src/bot/handlers/location.ts ===
// — Handler for incoming location messages; validates and stores location.

import type { Bot } from "grammy";
import {
  getUserState,
  setUserData,
  clearUserState,
  isValidLocation,
} from "../state.js";
import { mainMenuKeyboard } from "../keyboards.js";

export function registerLocationHandler(bot: Bot) {
  bot.on("message:location", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const state = getUserState(userId);

    if (state !== "awaiting_location") {
      await ctx.reply(
        "Unexpected location. If you want to register, press /start."
      );
      return;
    }

    const { latitude, longitude } = ctx.message.location;
    const loc = { lat: latitude, lon: longitude };

    if (!isValidLocation(loc)) {
      await ctx.reply("Invalid location. Please send a valid location.");
      return;
    }

    // — Save location and clear only the registration state
    setUserData(userId, { location: loc });
    clearUserState(userId);

    await ctx.reply("Location saved successfully.", {
      reply_markup: { remove_keyboard: true },
    });

    await ctx.reply("Please choose an option:", {
      reply_markup: mainMenuKeyboard,
    });
  });
}
