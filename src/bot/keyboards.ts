// === src/bot/keyboards.ts ===
// — Inline keyboards exported as constants to avoid re-creation.

import { InlineKeyboard } from "grammy";

// — Main menu keyboard
export const mainMenuKeyboard = new InlineKeyboard()
  .text("Set location", "set_location")
  .text("Set status", "set_status")
  .text("Help", "help")
  .row()
  .text("Look for loads", "loads");

// — Status selection keyboard
export const statusKeyboard = new InlineKeyboard()
  .text("Available", "status_available")
  .text("Busy", "status_busy")
  .row()
  .text("Back", "main_menu");

// — Simple back button
export const backToMenuKeyboard = new InlineKeyboard().text(
  "Back",
  "main_menu",
);

export function buildRateKeyboard(suggestedRate: number) {
  const low = suggestedRate - 50;
  const mid = suggestedRate;
  const high = suggestedRate + 50;

  return new InlineKeyboard()
    .text(`$${low}`, `rate_${low}`)
    .text(`$${mid}`, `rate_${mid}`)
    .text(`$${high}`, `rate_${high}`)
    .row()
    .text("Ввести вручную", "rate_manual");
}