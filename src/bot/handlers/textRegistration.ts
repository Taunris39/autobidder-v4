// src/bot/handlers/textRegistration.ts

import { Bot, Context } from "grammy";
import { setUserData, getUserState, setUserState } from "../state.js";

export function registerTextRegistration(bot: Bot) {
  bot.on("message:text", async (ctx: Context) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message?.text?.trim();
    if (!text) return;

    const state = getUserState(userId);

    if (state === "awaiting_name") {
      setUserData(userId, { userId, name: text });
      setUserState(userId, "awaiting_unit");
      await ctx.reply("Введите ваш unit (например, трак/прицеп):");
      return;
    }

    if (state === "awaiting_unit") {
      setUserData(userId, { unit: text });
      setUserState(userId, "awaiting_status");
      await ctx.reply("Введите ваш статус (available/busy):");
      return;
    }

    if (state === "awaiting_status") {
      setUserData(userId, { status: text });
      setUserState(userId, "idle");
      await ctx.reply("Регистрация завершена.");
      return;
    }
  });
}
