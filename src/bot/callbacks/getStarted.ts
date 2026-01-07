import type { Bot } from "grammy";
import { InlineKeyboard, InputFile } from "grammy";
import path from "path";
import fs from "fs";

const logoPath = path.resolve(process.cwd(), "assets/ursa-logo.jpg");

export function registerGetStarted(bot: Bot) {
  bot.callbackQuery("get_started", async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}

    try {
      await ctx.deleteMessage();
    } catch {}

    const inlineKeyboard = new InlineKeyboard().text("Agree", "agree");

    if (fs.existsSync(logoPath)) {
      try {
        await ctx.replyWithPhoto(new InputFile(logoPath), {
          caption:
            "Read terms and conditions carefully. By clicking 'Agree', you accept them.\n\nFor all questions, please contact @JonasMikkelsen.",
          reply_markup: inlineKeyboard,
        });
        return;
      } catch (err) {
        console.warn("replyWithPhoto failed:", err);
      }
    }

    await ctx.reply(
      "Read terms and conditions carefully. By clicking 'Agree', you accept them.\n\nFor all questions, please contact @JonasMikkelsen.",
      { reply_markup: inlineKeyboard }
    );
  });
}
