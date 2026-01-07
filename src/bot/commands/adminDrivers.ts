// src/bot/commands/adminDrivers.ts

import { Bot, Context } from "grammy";
import { getAllUserData } from "../state.js";

export function registerAdminDrivers(bot: Bot) {
  bot.command("admin_drivers", async (ctx: Context) => {
    const users = getAllUserData();

    if (users.length === 0) {
      await ctx.reply("Нет зарегистрированных водителей.");
      return;
    }

    const text = users
      .map(
        (u) => `• ${u.name ?? u.userId} — статус: ${u.status ?? "не указан"}`,
      )
      .join("\n");

    await ctx.reply(text);
  });
}
