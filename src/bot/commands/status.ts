// src/bot/commands/status.ts

import { Bot, Context } from "grammy";
import { getUserData, setUserData } from "../state.js";

export function registerStatusCommand(bot: Bot) {
  bot.command("status", async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const user = getUserData(userId);
    if (!user) {
      await ctx.reply("Ошибка: профиль не найден.");
      return;
    }

    const newStatus = user.status === "available" ? "busy" : "available";

    setUserData(userId, { status: newStatus });

    await ctx.reply(`Ваш статус обновлён: ${newStatus}`);
  });
}
