// === src/services/gmail/messageFetcher.ts ===
// — Fetch Gmail messages by ID and parse them.

import { google } from "googleapis";
import type { ParsedEmail } from "./types.js";
import { parseRawEmail } from "./parser.js";
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
    throw new Error(
      "GMAIL_REFRESH_TOKEN is not set; run OAuth flow to obtain it"
    );
  }
  client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
  return client;
}

const auth = createOAuth2Client();
const gmail = google.gmail({ version: "v1", auth });

export async function fetchAndParseMessage(
  messageId: string
): Promise<ParsedEmail | null> {
  try {
    const res = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "raw",
    });

    const raw = res.data.raw;
    if (!raw) {
      logger.warn(`Message ${messageId} has no raw payload`);
      return null;
    }

    const parsed = await parseRawEmail(raw);
    return parsed;
  } catch (err) {
    logger.error(`Failed to fetch message ${messageId}:`, err);
    return null;
  }
}
