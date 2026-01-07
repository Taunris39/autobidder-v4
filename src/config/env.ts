// === src/config/env.ts ===
// — Environment loader for the whole project.

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export function loadEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV ?? "development",

    BOT_TOKEN: process.env.BOT_TOKEN ?? "",
    ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID ?? "",

    GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID ?? "",
    GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET ?? "",
    GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI ?? "",
    GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN ?? "",

    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID ?? "",
    GMAIL_PUBSUB_SUBSCRIPTION: process.env.GMAIL_PUBSUB_SUBSCRIPTION ?? "",
    GMAIL_PUBSUB_TOPIC: process.env.GMAIL_PUBSUB_TOPIC ?? "",
  };
}
