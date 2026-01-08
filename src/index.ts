// src/index.ts

import { Bot } from "grammy";
import { initBot } from "./bot/init.js";

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is not set");
}

const bot = new Bot(token);

initBot(bot);

bot.start();
