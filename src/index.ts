// === src/index.ts ===
// — Entry point: register handlers, start bot, and handle graceful shutdown.

import { bot, registerAllBotHandlers } from "./bot/init.js";

registerAllBotHandlers();

// — Global error catcher for unhandled errors in handlers
bot.catch((err) => {
  console.error("Bot caught an error:", err);
});

// — Start the bot
async function startBot() {
  try {
    console.info("Bot is running...");
    await bot.start();
  } catch (err) {
    console.error("Failed to start bot:", err);
    process.exitCode = 1;
  }
}

startBot();

// === Graceful shutdown helpers ===
// — Ensures bot.stop() is called on termination signals
async function shutdown(signal: string) {
  console.info(`Received ${signal}. Stopping bot...`);
  try {
    await bot.stop();
    console.info("Bot stopped.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

// — Global process-level handlers for visibility
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
