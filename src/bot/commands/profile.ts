// src/bot/commands/profile.ts

import { Bot, Context } from "grammy";
import { getUserData } from "../state.js";

export function registerProfile(bot: Bot) {
  bot.command("profile", async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const user = getUserData(userId);
    if (!user) {
      await ctx.reply("Профиль не найден.");
      return;
    }

    const locationText = user.location
      ? `${user.location.lat}, ${user.location.lon}`
      : "не указана";

    const text =
      `Ваш профиль:\n` +
      `Имя: ${user.name ?? "не указано"}\n` +
      `Статус: ${user.status ?? "не указан"}\n` +
      `Локация: ${locationText}`;

    await ctx.reply(text);
  });
}
