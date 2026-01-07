// === src/services/gmail/watch.ts ===
// — Utility to register Gmail watch (run manually or from setup script).

import { google } from "googleapis";
import { loadEnv } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

const env = loadEnv();

function createOAuth2Client() {
  const {
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI,
    GMAIL_REFRESH_TOKEN,
  } = env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REDIRECT_URI) {
    throw new Error(
      "GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI must be set"
    );
  }
  const client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI
  );
  if (!GMAIL_REFRESH_TOKEN) {
    throw new Error("GMAIL_REFRESH_TOKEN is not set");
  }
  client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
  return client;
}

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
