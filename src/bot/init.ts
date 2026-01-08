// === src/bot/init.ts ===
// — Create and export the Bot instance and register handlers.
// — Pattern: modules export registerX(bot) functions for explicit initialization.

import {Bot} from "grammy";
import {loadEnv} from "../config/env.js";

const {BOT_TOKEN} = loadEnv();

if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is missing in environment variables");
}

export const bot = new Bot(BOT_TOKEN);

// === Register functions (no side-effect imports) ===


// === Callbacks ===
import {registerAgree} from "./callbacks/agree.js";
import {registerGetStarted} from "./callbacks/getStarted.js";
import {registerHelp} from "./callbacks/help.js";
import {registerLoads} from "./callbacks/loads.js";
import {registerMainMenu} from "./callbacks/mainMenu.js";
import {registerRateCallback} from "./callbacks/rate.js";
import {registerSetLocation} from "./callbacks/setLocation.js";
import {registerSetStatus} from "./callbacks/setStatus.js";
import {registerSkipCallback} from "./callbacks/skip.js";
import {registerStatusAvailable} from "./callbacks/statusAvailable.js";
import {registerStatusBusy} from "./callbacks/statusBusy.js";


// === Commands ===
import {registerAdminDrivers} from "./commands/adminDrivers.js";
import {registerAdminLoadDetails} from "./commands/adminLoadDetails.js";
import {registerAdminLoads} from "./commands/adminLoads.js";
import {registerLocationCommand} from "./commands/location.js";
import {registerMenu} from "./commands/menu.js";
import {registerMyLoads} from "./commands/myLoads.js";
import {registerProfile} from "./commands/profile.js";
import {registerStart} from "./commands/start.js";
import {registerStatusCommand} from "./commands/status.js";


// === Handlers ===
import {registerLocationHandler} from "./handlers/location.js";
import {registerTextBidding} from "./handlers/textBidding.js";
import {registerTextRegistration} from "./handlers/textRegistration.js";

// === Initialize bot ===
export function initBot(bot: Bot) {

    // === Callbacks ===
    registerAgree(bot);
    registerGetStarted(bot);
    registerHelp(bot);
    registerLoads(bot);
    registerMainMenu(bot);
    registerRateCallback(bot);
    registerSetLocation(bot);
    registerSetStatus(bot);
    registerSkipCallback(bot);
    registerStatusAvailable(bot);
    registerStatusBusy(bot);

    // === Commands ===
    registerAdminDrivers(bot);
    registerAdminLoadDetails(bot);
    registerAdminLoads(bot);
    registerLocationCommand(bot);
    registerMenu(bot);
    registerMyLoads(bot);
    registerProfile(bot);
    registerStart(bot);
    registerStatusCommand(bot);

    // === Handlers ===
    registerLocationHandler(bot);
    registerTextBidding(bot);
    registerTextRegistration(bot);

}
