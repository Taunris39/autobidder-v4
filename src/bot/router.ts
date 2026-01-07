// === src/bot/router.ts ===
// — Global middleware: simple logger for incoming updates.

import { bot } from "./init.js";

bot.use(async (ctx, next) => {
  try {
    const from = ctx.from ? `${ctx.from.username ?? ctx.from.id}` : "unknown";
    // — ctx.updateType may not be typed; use safe fallback
    const updateType =
      (ctx as any).updateType ??
      (ctx.update ? Object.keys(ctx.update)[0] : "unknown");
    console.info(`Incoming update from ${from}: ${updateType}`);
  } catch (e) {
    console.warn("Failed to log update:", e);
  }
  await next();
});
