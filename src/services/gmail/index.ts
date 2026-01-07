// src/services/gmail/index.ts
import type { ParsedEmail } from "./types.ts";
import { extractLoadData, stripHtml } from "./structuredExtractor.js";
import { bot } from "../../bot/init.js";
import { loadEnv } from "../../config/env.js";
import { appendFileSync } from "fs";

const env = loadEnv();

/**
 * ALLOWED_VEHICLE_TYPES можно задать в .env как CSV:
 * ALLOWED_VEHICLE_TYPES=Large Straight,Cargo Van,Box Truck

const ALLOWED_VEHICLE_TYPES = (env.ALLOWED_VEHICLE_TYPES ?? "Large Straight,Cargo Van,Box Truck")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
*/

/**
 * Обработчик разобранного письма.
 * - извлекает структурированные данные
 * - фильтрует по vehicleType
 * - формирует Markdown‑сообщение и отправляет боту
 */
export async function handleParsedEmail(
  mailboxId: string,
  messageId: string,
  email: ParsedEmail
) {
  try {
    // в начале handleParsedEmail, перед extractload
    console.log(`[DEBUG] message=${messageId} headers:`, {
      subject: email.subject ?? null,
      from: email.from ?? null,
      textLength: email.text ? email.text.length : 0,
      htmlLength: email.html ? email.html.length : 0,
      attachments: Array.isArray(email.attachments)
        ? email.attachments.map((a) => a.filename ?? a.contentType)
        : [],
    });

    // в handleParsedEmail, пример проверки vehicleType
    const load = extractLoadData(email);
    const vt = load.vehicleType?.trim();
    if (!vt) {
      console.log(`[SKIP] message=${messageId} — vehicleType not found`);
      dumpSkipped(messageId, email);
      return;
    }

    // Собираем тело письма: используем текст если есть, иначе короткий набор полей
    const rawText = (email.text ?? "").trim();
    const preview =
      rawText.length > 1200
        ? rawText.slice(0, 1200) + "…"
        : rawText || "Текст письма отсутствует";

    // формирование Markdown‑сообщения (без orderId, без Posted, без превью)
    const md =
      `📦 *Новая загрузка*\n` +
      `*Откуда:* ${load.pickupLocation ?? "—"}\n` +
      `*Куда:* ${load.deliveryLocation ?? "—"}\n` +
      `*Расстояние:* ${load.miles ?? "—"} миль\n` +
      `*Остановок:* ${load.stops ?? "—"}\n` +
      `*Вес:* ${load.weight ?? "—"} lbs\n` +
      `*Транспорт:* ${vt}\n` +
      `*Dock Level:* ${load.dockLevel ? "✅" : "❌"}\n` +
      `*Hazmat:* ${load.hazmat ? "✅" : "❌"}\n` +
      `*Notes:* ${load.notes ?? "—"}\n` +
      (load.dimensions ? `*Dimensions:* ${load.dimensions}\n` : "") +
      (load.pieces !== undefined ? `*Pieces:* ${load.pieces}\n` : "") +
      (load.stackable !== undefined
        ? `*Stackable:* ${load.stackable ? "✅" : "❌"}\n`
        : "");

    await bot.api.sendMessage(env.ADMIN_CHAT_ID, md, {
      parse_mode: "Markdown",
    });

    console.log(
      `[SENT] message=${messageId} vehicleType="${vt}" order=${load.orderId ?? "—"}`
    );
  } catch (err) {
    console.error("[ERROR] handleParsedEmail:", err);
  }
}

function dumpSkipped(messageId: string, email: any) {
  const preview =
    (email.text ?? "") || (email.html ? stripHtml(email.html) : "");
  const short = preview ? preview.slice(0, 5000) : "<empty>";
  const meta = `--- ${new Date().toISOString()} message=${messageId} subject=${email.subject ?? "—"}\n`;
  appendFileSync("skipped_loads.log", meta + short + "\n\n");
}
