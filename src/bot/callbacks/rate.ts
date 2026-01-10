// src/bot/callbacks/rate.ts

import { Bot, Context } from "grammy";
import { getUserData, setUserData } from "../state.js";
import { getLoad } from "../../services/loadService.js";

export function registerRateCallback(bot: Bot) {
  bot.callbackQuery("rate", async (ctx: Context) => {

    const rawId = ctx.from?.id;
    if (!rawId) return;
    const userId = String(rawId);

    const userData = getUserData(userId);
    if (!userData) {
      await ctx.reply("Ошибка: данные пользователя не найдены.");
      return;
    }

    const loadId = userData.currentLoadId;
    if (!loadId) {
      await ctx.reply("Ошибка: нет активного груза.");
      return;
    }

    const load = getLoad(loadId);
    if (!load) {
      await ctx.reply("Ошибка: груз не найден.");
      return;
    }

    // Переводим пользователя в режим ввода кастомной ставки
    setUserData(userId, { state: "awaiting_custom_rate" });

    await ctx.reply("Введите вашу ставку:");
  });
}
