// src/bot/commands/myLoads.ts

import { Bot, Context } from "grammy";
import { getAllLoads } from "../../services/loadService.js";

export function registerMyLoads(bot: Bot) {
  bot.command("my_loads", async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const loads = getAllLoads().filter((l) =>
      l.quotes.some((q) => q.driverId === userId),
    );

    if (loads.length === 0) {
      await ctx.reply("У вас нет активных грузов.");
      return;
    }

    const text = loads
      .map((l) => {
        const quote = l.quotes.find((q) => q.driverId === userId);
        return `• ${l.id} — ваша ставка: $${quote?.price ?? "?"}`;
      })
      .join("\n");

    await ctx.reply(text);
  });
}
