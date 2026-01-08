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

    const text = ctx.message?.text;
    if (!text) return;

    const price = Number(text);
    if (isNaN(price)) {
      await ctx.reply("Введите число.");
      return;
    }

    load.quotes.push({ driverId: userId, price });
    saveLoad(load);

    setUserData(userId, { state: "idle" });

    await ctx.reply(`Ставка $${price} отправлена.`);
  });
}
