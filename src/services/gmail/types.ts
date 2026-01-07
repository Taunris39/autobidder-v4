// === src/services/gmail/types.ts ===
// — Shared types for Gmail processing.

import type { Attachment } from "mailparser";

export interface ParsedEmail {
  id: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  attachments: Attachment[];
  date: Date;
}

export interface GmailPubSubPayload {
  emailAddress?: string;
  historyId?: string;
}
