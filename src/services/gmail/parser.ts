// === src/services/gmail/parser.ts ===
// — Parse raw base64 Gmail message using mailparser.

import { simpleParser } from "mailparser";
import type { ParsedEmail } from "./types.js";

export async function parseRawEmail(
  rawBase64Url: string
): Promise<ParsedEmail> {
  // Gmail returns base64url; convert to standard base64
  const rawBase64 = rawBase64Url.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Buffer.from(rawBase64, "base64");
  const parsed = await simpleParser(buffer);

  return {
    id: parsed.messageId ?? "",
    from: parsed.from?.text ?? "(unknown)",
    subject: parsed.subject ?? "(no subject)",
    text: parsed.text ?? "",
    html: parsed.html || "",
    attachments: parsed.attachments ?? [],
    date: parsed.date ?? new Date(),
  };
}
