// src/bot/notifier.ts

import { Bot } from "grammy";
import { getUserData } from "./state.js";

export async function notifyAdminAboutQuote(
  bot: Bot,
  loadId: string,
  driverId: number,
  price: number,
) {
  const driver = getUserData(driverId);
  const driverName = driver?.name ?? `Водитель ${driverId}`;

  const text =
    `Новая ставка!\n` +
    `Груз: ${loadId}\n` +
    `Водитель: ${driverName}\n` +
    `Ставка: $${price}`;

  const adminChatId = Number(process.env.ADMIN_CHAT_ID);
  if (!adminChatId) return;

  await bot.api.sendMessage(adminChatId, text);
}
