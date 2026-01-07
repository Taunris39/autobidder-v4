// src/bot/sendLoad.ts

import { Bot } from "grammy";
import { getUserData, setUserData } from "./state.js";
import { calculateSuggestedRate } from "../services/rateCalculator.js";
import { Load } from "../types.js";

export async function sendLoadToDriver(bot: Bot, driverId: number, load: Load) {
  const driver = getUserData(driverId);
  if (!driver) return;

  const suggested = calculateSuggestedRate(load, driver);

  // Сохраняем активный груз для водителя
  setUserData(driverId, { currentLoadId: load.id });

  const text =
    `Новый груз!\n` +
    `ID: ${load.id}\n` +
    `Миль: ${load.miles}\n` +
    `Рекомендуемая ставка: $${suggested}`;

  await bot.api.sendMessage(driverId, text);
}
