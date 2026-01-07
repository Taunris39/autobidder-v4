// === src/bot/init.ts ===
// — Create and export the Bot instance and register handlers.
// — Pattern: modules export registerX(bot) functions for explicit initialization.

import { Bot } from "grammy";
import { loadEnv } from "../config/env.js";

const { BOT_TOKEN } = loadEnv();

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is missing in environment variables");
}

export const bot = new Bot(BOT_TOKEN);

// === Register functions (no side-effect imports) ===
import { registerStart } from "./commands/start.js";
import { registerMenu } from "./commands/menu.js";

import { registerGetStarted } from "./callbacks/getStarted.js";
import { registerAgree } from "./callbacks/agree.js";
import { registerSetLocation } from "./callbacks/setLocation.js";
import { registerSetStatus } from "./callbacks/setStatus.js";
import { registerStatusAvailable } from "./callbacks/statusAvailable.js";
import { registerStatusBusy } from "./callbacks/statusBusy.js";
import { registerHelp } from "./callbacks/help.js";
import { registerLoads } from "./callbacks/loads.js";
import { registerMainMenu } from "./callbacks/mainMenu.js";

import { registerTextRegistration } from "./handlers/textRegistration.js";
import { registerLocationHandler } from "./handlers/location.js";

// — Call this once at startup
export function registerAllBotHandlers() {
  // Commands
  registerStart(bot);
  registerMenu(bot);

  // Callbacks
  registerGetStarted(bot);
  registerAgree(bot);
  registerSetLocation(bot);
  registerSetStatus(bot);
  registerStatusAvailable(bot);
  registerStatusBusy(bot);
  registerHelp(bot);
  registerLoads(bot);
  registerMainMenu(bot);

  // Handlers
  registerTextRegistration(bot);
  registerLocationHandler(bot);
}
