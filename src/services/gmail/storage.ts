// === src/services/gmail/storage.ts ===
// — Storage interface for historyId and processed message IDs.
// — In-memory implementation for dev; replace with Redis/DB in production.

export interface IGmailStorage {
  getLastHistoryId(mailbox: string): Promise<string | null>;
  setLastHistoryId(mailbox: string, historyId: string): Promise<void>;

  isMessageProcessed(messageId: string): Promise<boolean>;
  markMessageProcessed(messageId: string): Promise<void>;
}

export class InMemoryGmailStorage implements IGmailStorage {
  private history = new Map<string, string>();
  private processed = new Set<string>();

  async getLastHistoryId(mailbox: string): Promise<string | null> {
    return this.history.get(mailbox) ?? null;
  }

  async setLastHistoryId(mailbox: string, historyId: string): Promise<void> {
    this.history.set(mailbox, historyId);
  }

  async isMessageProcessed(messageId: string): Promise<boolean> {
    return this.processed.has(messageId);
  }

  async markMessageProcessed(messageId: string): Promise<void> {
    this.processed.add(messageId);
  }
}
