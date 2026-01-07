// src/bot/callbacks/skip.ts

import { Bot, Context } from "grammy";
import { getUserData, setUserData } from "../state.js";

export function registerSkipCallback(bot: Bot) {
  bot.callbackQuery("skip_load", async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const user = getUserData(userId);
    if (!user) {
      await ctx.reply("Ошибка: данные пользователя не найдены.");
      return;
    }

    // Сбрасываем активный груз и состояние
    setUserData(userId, {
      currentLoadId: undefined,
      state: "idle",
    });

    await ctx.reply("Груз пропущен.");
  });
}
