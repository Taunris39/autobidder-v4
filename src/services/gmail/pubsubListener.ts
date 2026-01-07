// === src/services/gmail/pubsubListener.ts ===
// — Pub/Sub listener: receives Gmail push notifications and triggers HistoryProcessor.

import { PubSub, Message } from "@google-cloud/pubsub";
import type { IGmailStorage } from "./storage.js";
import { HistoryProcessor } from "./historyProcessor.js";
import type { GmailPubSubPayload } from "./types.js";
import { loadEnv } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

const env = loadEnv();

export class GmailPubSubListener {
  private pubsub: PubSub;
  private subscriptionName: string;
  private historyProcessor: HistoryProcessor;

  constructor(storage: IGmailStorage, mailboxId: string) {
    if (!env.GMAIL_PUBSUB_SUBSCRIPTION) {
      throw new Error("GMAIL_PUBSUB_SUBSCRIPTION is not set");
    }

    this.pubsub = env.GCP_PROJECT_ID
      ? new PubSub({ projectId: env.GCP_PROJECT_ID })
      : new PubSub();
    this.subscriptionName = env.GMAIL_PUBSUB_SUBSCRIPTION;
    this.historyProcessor = new HistoryProcessor(storage, mailboxId);
  }

  start() {
    const subscription = this.pubsub.subscription(this.subscriptionName);

    subscription.on("message", async (message: Message) => {
      try {
        await this.handleMessage(message);
        message.ack();
      } catch (err) {
        logger.error("Failed to process Pub/Sub message:", err);
        // message.nack(); // optional
      }
    });

    subscription.on("error", (err) => {
      logger.error("Pub/Sub subscription error:", err);
    });

    logger.info(
      `Listening for Gmail Pub/Sub messages on ${this.subscriptionName}`
    );
  }

  private async handleMessage(message: Message) {
    const dataStr = message.data ? message.data.toString() : "";
    let payload: GmailPubSubPayload | null = null;

    try {
      payload = JSON.parse(dataStr) as GmailPubSubPayload;
    } catch (err) {
      logger.warn("Invalid Pub/Sub message data, ignoring:", err);
      return;
    }

    const historyId = payload.historyId;
    await this.historyProcessor.handleHistoryId(historyId);
  }
}
