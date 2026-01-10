// === src/services/gmail/watch.ts ===
// — Utility to register Gmail watch (run manually or from setup script).

import { google } from "googleapis";
import { loadEnv } from "../../config/env.js";
import { logger } from "../../utils/logger.js";
import { createOAuth2Client } from "./oauth.js";

const env = loadEnv();


export async function registerGmailWatch() {
  if (!env.GMAIL_PUBSUB_TOPIC) {
    throw new Error("GMAIL_PUBSUB_TOPIC is not set");
  }

   const auth = createOAuth2Client();
   const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: env.GMAIL_PUBSUB_TOPIC,
      labelIds: ["INBOX"],
    },
  });

  logger.info("Gmail watch registered:", res.data);
  return res.data;
}
