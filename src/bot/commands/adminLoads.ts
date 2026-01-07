// src/bot/commands/adminLoads.ts

import { Bot, Context } from "grammy";
import { getAllLoads } from "../../services/loadService.js";

export function registerAdminLoads(bot: Bot) {
  bot.command("admin_loads", async (ctx: Context) => {
    const loads = getAllLoads();

    if (loads.length === 0) {
      await ctx.reply("Нет активных грузов.");
      return;
    }

    const text = loads
      .map((l) => `• ${l.id} — статус: ${l.status}, ставок: ${l.quotes.length}`)
      .join("\n");

    await ctx.reply(text);
  });
}
