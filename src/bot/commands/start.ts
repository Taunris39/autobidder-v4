// === src/bot/commands/start.ts ===
// — /start command: welcome message and "Get Started" button.

import type { Bot } from "grammy";
import { InlineKeyboard, InputFile } from "grammy";
import path from "path";
import fs from "fs";

const logoPath = path.resolve(process.cwd(), "assets/ursa-logo.jpg");

export function registerStart(bot: Bot) {
  bot.command("start", async (ctx) => {
    const inlineKeyboard = new InlineKeyboard().text(
      "Get Started",
      "get_started"
    );

    try {
      // — If logo exists, send as photo; otherwise fallback to text.
      if (fs.existsSync(logoPath)) {
        await ctx.replyWithPhoto(new InputFile(logoPath), {
          caption:
            "Welcome to UrsaExpressBot!\nThis bot was created to get loads whenever you need them. To get started, press the button below.",
          reply_markup: inlineKeyboard,
        });
        return;
      }
    } catch (err) {
      // — Non-fatal: log and continue with text fallback.
      console.warn("replyWithPhoto failed:", err);
    }

    await ctx.reply(
      "Welcome to UrsaExpressBot! Press the button below to get started.",
      { reply_markup: inlineKeyboard }
    );
  });
}
