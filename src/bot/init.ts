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
import { registerAdminLoads } from "./commands/adminLoads.js";
import { registerAdminLoadDetails } from "./commands/adminLoadDetails.js";
import { registerAdminDrivers } from "./commands/adminDrivers.js";
import { registerProfileCommand } from "./commands/profile.js";
import { registerStatusCommand } from "./commands/status.js";
import { registerLocationCommand } from "./commands/location.js";
import { registerMyLoadsCommand } from "./commands/myLoads.js";

import { registerGetStarted } from "./callbacks/getStarted.js";
import { registerAgree } from "./callbacks/agree.js";
import { registerSetLocation } from "./callbacks/setLocation.js";
import { registerSetStatus } from "./callbacks/setStatus.js";
import { registerStatusAvailable } from "./callbacks/statusAvailable.js";
import { registerStatusBusy } from "./callbacks/statusBusy.js";
import { registerHelp } from "./callbacks/help.js";
import { registerLoads } from "./callbacks/loads.js";
import { registerMainMenu } from "./callbacks/mainMenu.js";
import { registerRateCallbacks } from "./callbacks/rate.js";

import { registerTextRegistration } from "./handlers/textRegistration.js";
import { registerLocationHandler } from "./handlers/location.js";
import { registerTextBidding } from "./handlers/textBidding.js";

// — Call this once at startup
export function registerAllBotHandlers() {
  // Commands
  registerStart(bot);
  registerMenu(bot);
  registerAdminLoads(bot);
  registerAdminLoadDetails(bot);
  registerAdminDrivers(bot);
  registerProfileCommand(bot);
  registerStatusCommand(bot);
  registerLocationCommand(bot);
  registerMyLoadsCommand(bot);

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
  registerRateCallbacks(bot);

  // Handlers
  registerTextRegistration(bot);
  registerLocationHandler(bot);
  registerTextBidding(bot);
}
