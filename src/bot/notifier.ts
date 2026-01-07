// === src/bot/notifier.ts ===
// — Helper for sending messages from Gmail pipeline to Telegram.

import { bot } from "./init.js";
import { loadEnv } from "../config/env.js";
import { logger } from "../utils/logger.js";

const env = loadEnv();

export interface EmailNotificationPayload {
  subject: string;
  from: string;
  textPreview: string;
  orderId?: string | null;
}

export async function notifyAdminAboutEmail(payload: EmailNotificationPayload) {
  if (!env.ADMIN_CHAT_ID) {
    logger.warn("ADMIN_CHAT_ID is not set; cannot notify admin about email");
    return;
  }

  const message =
    `📧 New email received\n` +
    `From: ${payload.from}\n` +
    `Subject: ${payload.subject}\n` +
    (payload.orderId ? `Order ID: ${payload.orderId}\n` : "") +
    `Preview:\n${payload.textPreview.slice(0, 500)}`;

  try {
    await bot.api.sendMessage(env.ADMIN_CHAT_ID, message);
  } catch (err) {
    logger.error("Failed to send email notification to admin:", err);
  }
}
