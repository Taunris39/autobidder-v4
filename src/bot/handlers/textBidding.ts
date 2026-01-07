// src/bot/handlers/textBidding.ts

import { Bot, Context } from "grammy";
import { getUserData, setUserData } from "../state.js";
import { getLoad, saveLoad } from "../../services/loadService.js";

export function registerTextBidding(bot: Bot) {
  bot.on("message:text", async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const userData = getUserData(userId);
    if (!userData) return;

    // Обрабатываем только если пользователь вводит кастомную ставку
    if (userData.state !== "awaiting_custom_rate") return;

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

    const price = Number(ctx.message.text);
    if (isNaN(price)) {
      await ctx.reply("Введите число.");
      return;
    }

    // Добавляем ставку
    load.quotes.push({ driverId: userId, price });
    saveLoad(load);

    // Сбрасываем состояние
    setUserData(userId, { state: "idle" });

    await ctx.reply(`Ставка $${price} отправлена.`);
  });
}
