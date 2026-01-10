// === src/services/gmail/historyProcessor.ts ===
// — Process Gmail history: history.list -> messagesAdded -> fetch & parse.

import { google } from "googleapis";
import pRetry from "p-retry";
import type { IGmailStorage } from "./storage.js";
import { fetchAndParseMessage } from "./messageFetcher.js";
import { logger } from "../../utils/logger.js";
import { handleParsedEmail } from "./index.js";
import { createOAuth2Client } from "./oauth.js";


const auth = createOAuth2Client();
const gmail = google.gmail({ version: "v1", auth });

export class HistoryProcessor {
  constructor(
    private storage: IGmailStorage,
    private mailboxId: string
  ) {}

  async handleHistoryId(incomingHistoryId?: string) {
    const lastHistoryId = await this.storage.getLastHistoryId(this.mailboxId);
    const startHistoryId = lastHistoryId ?? incomingHistoryId ?? null;

    if (!startHistoryId) {
      logger.info("No startHistoryId; falling back to recent messages");
      await this.fetchRecentMessages();
      return;
    }

    await pRetry(
      async () => {
        await this.fetchHistoryAndProcess(startHistoryId!);
      },
      {
        retries: 5,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 30000,
        onFailedAttempt: (err) => {
          logger.warn(
            `history.list attempt ${err.attemptNumber} failed. ${err.retriesLeft} retries left.`,
            err
          );
        },
      }
    );
  }

  private async fetchHistoryAndProcess(startHistoryId: string) {
    const res = await gmail.users.history.list({
      userId: "me",
      startHistoryId,
    });

    const history = res.data.history ?? [];
    if (history.length === 0) {
      if (res.data.historyId) {
        await this.storage.setLastHistoryId(this.mailboxId, res.data.historyId);
      }
      return;
    }

    const messageIds = new Set<string>();
    for (const h of history) {
      const added = h.messagesAdded ?? [];
      for (const ma of added) {
        const id = ma.message?.id;
        if (id) messageIds.add(id);
      }
    }

    for (const messageId of messageIds) {
      const already = await this.storage.isMessageProcessed(messageId);
      if (already) {
        logger.info(`Skipping already processed message ${messageId}`);
        continue;
      }

      const parsed = await fetchAndParseMessage(messageId);
      if (!parsed) continue;

      try {
        await handleParsedEmail(messageId, parsed);
        await this.storage.markMessageProcessed(messageId);
      } catch (err) {
        logger.error(`Failed to handle parsed email ${messageId}:`, err);
      }
    }

    if (res.data.historyId) {
      await this.storage.setLastHistoryId(this.mailboxId, res.data.historyId);
    }
  }

  private async fetchRecentMessages() {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: 20,
    });

    const messages = res.data.messages ?? [];
    for (const m of messages) {
      const id = m.id;
      if (!id) continue;
      const already = await this.storage.isMessageProcessed(id);
      if (already) continue;

      const parsed = await fetchAndParseMessage(id);
      if (!parsed) continue;

      try {
        await handleParsedEmail(id, parsed);
        await this.storage.markMessageProcessed(id);
      } catch (err) {
        logger.error("Failed to handle recent message", id, err);
      }
    }
  }
}
