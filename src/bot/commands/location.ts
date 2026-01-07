// src/bot/commands/location.ts

import { Bot, Context } from "grammy";
import {
  getUserData,
  setUserData,
  setUserState,
  getUserState,
  clearUserState,
} from "../state.js";

export function registerLocationCommand(bot: Bot) {
  // Команда для запроса обновления локации
  bot.command("location", async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    setUserState(userId, "awaiting_location_update");

    await ctx.reply("Отправьте вашу геолокацию.");
  });

  // Обработка сообщения с геолокацией
  bot.on("message:location", async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const state = getUserState(userId);
    if (state !== "awaiting_location_update") return;

    const user = getUserData(userId);
    if (!user) {
      await ctx.reply("Ошибка: данные пользователя не найдены.");
      return;
    }

    const { latitude, longitude } = ctx.message.location;

    setUserData(userId, {
      location: { lat: latitude, lon: longitude },
      lastLocationUpdate: Date.now(),
    });

    clearUserState(userId);

    await ctx.reply("Локация обновлена.");
  });
}
