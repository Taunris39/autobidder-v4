// src/bot/handlers/location.ts

import { Bot, Context } from "grammy";

export function registerLocationHandler(bot: Bot) {
  // Логика обработки локации перенесена в commands/location.ts
  // Этот хендлер оставлен пустым, чтобы не ломать init.ts
  bot.on("message:location", async (_ctx: Context) => {
    // no-op
  });
}
