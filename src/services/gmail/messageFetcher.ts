// === src/services/gmail/messageFetcher.ts ===
// — Fetch Gmail messages by ID and parse them.

import { google } from "googleapis";
import type {ParsedEmail} from "./types.js";
import {parseRawEmail} from "./parser.js";
import { logger } from "../../utils/logger.js";
import { createOAuth2Client } from "./oauth.js";



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

    return await parseRawEmail(raw);
  } catch (err) {
    logger.error(`Failed to fetch message ${messageId}:`, err);
    return null;
  }
}
