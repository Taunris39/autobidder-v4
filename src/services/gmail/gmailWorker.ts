// === src/workers/gmailWorker.ts ===
// — Entry point for Gmail Pub/Sub worker.

import { InMemoryGmailStorage } from "./storage.js";
import { GmailPubSubListener } from "./pubsubListener.js";
import { logger } from "../../utils/logger.js";

async function main() {
  // — In production, replace with Redis/DB storage
  const storage = new InMemoryGmailStorage();
  const mailboxId = "me"; // or actual email address if you want

  // — Start Telegram bot (so notifier can send messages)

  // — Start Gmail Pub/Sub listener
  const listener = new GmailPubSubListener(storage, mailboxId);
  listener.start();

  logger.info("Gmail worker started");
}

  main().catch((err) => {
  logger.error("Gmail worker failed:", err);
  process.exit(1);
});
