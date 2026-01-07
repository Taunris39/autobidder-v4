// src/bot/commands/adminLoadDetails.ts

import { Bot, Context } from "grammy";
import { getLoad } from "../../services/loadService.js";
import { getUserData } from "../state.js";

export function registerAdminLoadDetails(bot: Bot) {
  bot.command("admin_load", async (ctx: Context) => {
    const loadId = ctx.match;
    if (!loadId) {
      await ctx.reply("Укажите ID груза: /admin_load <id>");
      return;
    }

    const load = getLoad(loadId);
    if (!load) {
      await ctx.reply("Груз не найден.");
      return;
    }

    const quotesText =
      load.quotes.length > 0
        ? load.quotes
            .map((q) => {
              const driver = getUserData(q.driverId);
              const driverName = driver?.name ?? `Водитель ${q.driverId}`;
              return `• ${driverName} — $${q.price}`;
            })
            .join("\n")
        : "Нет ставок";

    const text =
      `Груз: ${load.id}\n` +
      `Статус: ${load.status}\n` +
      `Миль: ${load.miles}\n\n` +
      `Ставки:\n${quotesText}`;

    await ctx.reply(text);
  });
}
