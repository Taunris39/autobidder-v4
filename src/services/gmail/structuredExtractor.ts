// src/services/gmail/structuredExtractor.ts
import type { ParsedEmail } from "./types.js";

export interface ExtractedLoadData {
  orderId?: string | undefined;
  pickupLocation?: string | undefined;
  deliveryLocation?: string | undefined;
  miles?: number | undefined;
  stops?: number | undefined;
  weight?: number | undefined;
  pieces?: number | undefined;
  vehicleType?: string | undefined;
  brokerName?: string | undefined;
  brokerCompany?: string | undefined;
  brokerPhone?: string | undefined;
  brokerEmail?: string | undefined;
  postedDate?: string | undefined;
  postedTime?: string | undefined;
  dockLevel?: boolean | undefined;
  hazmat?: boolean | undefined;
  notes?: string | undefined;
  dimensions?: string | undefined;
  stackable?: boolean | undefined;
  status?: string | undefined;
}

export function extractLoadData(email: ParsedEmail): ExtractedLoadData {
  const text =
    (email.text ?? "") + (email.html ? "\n" + stripHtml(email.html) : "");
  const cleaned = normalize(text);

  return {
    orderId: firstMatch(/Order\s*#\s*(\d+)/i, cleaned),
    pickupLocation:
      firstMatch(/Pick[- ]?Up\s*\n([\s\S]*?)\n/i, cleaned) ??
      firstMatch(/from\s*([\w\s,]+ \d{5})/i, cleaned),
    deliveryLocation:
      firstMatch(/Delivery\s*\n([\s\S]*?)\n/i, cleaned) ??
      firstMatch(/to\s*([\w\s,]+ \d{5})/i, cleaned),
    miles: firstNumber(/(\d+)\s*MILES/i, cleaned),
    stops: firstNumber(/(\d+)\s*STOPS/i, cleaned),
    weight: firstNumber(/Weight[:\s]*([\d.,]+)\s*lbs/i, cleaned),
    pieces: firstNumber(/Pieces[:\s]*(\d+)/i, cleaned),
    // ЗДЕСЬ: используем findVehicleType для надёжного извлечения
    vehicleType: findVehicleTypeInTextAndSubject(cleaned),
    brokerName: firstMatch(/Broker Name[:\s]*([^\n\r]+)/i, cleaned),
    brokerCompany: firstMatch(/Broker Company[:\s]*([^\n\r]+)/i, cleaned),
    brokerPhone: firstMatch(/Broker Phone[:\s]*([\d+\-\s().]+)/i, cleaned),
    brokerEmail: firstMatch(/Email[:\s]*([\w.+-]+@[\w.-]+)/i, cleaned),
    postedDate: firstMatch(/Posted[:\s]*([0-9\/\-\s:APMapm]+)/i, cleaned),
    postedTime: firstMatch(
      /Posted[:\s]*[0-9\/\-\s:APMapm]*\s([0-9:]{4,5}\s*[APMapm]{0,2})/i,
      cleaned
    ),
    dockLevel: /Dock Level[:\s]*Yes/i.test(cleaned),
    hazmat: /Hazmat[:\s]*Yes/i.test(cleaned),
    notes: firstMatch(/Notes[:\s]*([^\n\r]+)/i, cleaned),
    dimensions: firstMatch(/Dimensions[:\s]*([^\n\r]+)/i, cleaned),
    stackable: /Stackable[:\s]*Yes/i.test(cleaned),
    status: firstMatch(/Status[:\s]*([^\n\r]+)/i, cleaned),
  };
}

/* Helpers */

function normalize(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function firstMatch(regex: RegExp, text: string): string | undefined {
  const m = text.match(regex);
  return m && m[1] ? m[1].trim() : undefined;
}

function firstNumber(regex: RegExp, text: string): number | undefined {
  const s = firstMatch(regex, text);
  if (!s) return undefined;
  const n = parseFloat(s.replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Надёжная нормализация типов транспорта
export function normalizeVehicleType(raw?: string): string | undefined {
  if (!raw) return undefined;
  const v = raw.trim().toLowerCase();

  // Канонические соответствия
  if (v.includes("large straight") || v.includes("straight truck"))
    return "Large Straight";
  if (v.includes("box") || v.includes("box truck")) return "Box Truck";
  if (v.includes("cargo van") || (v.includes("cargo") && v.includes("van")))
    return "Cargo Van";
  if (v.includes("sprinter")) return "Sprinter";
  if (v.includes("van") && !v.includes("cargo")) return "Van";
  if (
    v.includes("tractor") ||
    v.includes("semi") ||
    v.includes("reefer") ||
    v.includes("dry van")
  )
    return raw.trim().replace(/\s+/g, " ");
  // fallback — Title Case
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

// Поиск vehicleType в тексте и subject
export function findVehicleTypeInTextAndSubject(
  text: string,
  subject?: string
): string | undefined {
  const combined = (text ?? "") + "\n" + (subject ?? "");
  const t = combined.replace(/\s+/g, " ").trim();

  // Явные метки
  const labelPatterns: RegExp[] = [
    /Vehicle required[:\s-]*([A-Za-z0-9 \-]+)/i,
    /Types Type[:\s-]*([A-Za-z0-9 \-]+)/i,
    /Type[:\s-]*([A-Za-z0-9 \-]+)/i,
    /Vehicle[:\s-]*([A-Za-z0-9 \-]+)/i,
  ];
  for (const p of labelPatterns) {
    const m = t.match(p);
    if (m && m[1]) return normalizeVehicleType(m[1]);
  }

  // Ключевые слова / фразы
  const keywordMap: [RegExp, string][] = [
    [/large straight/i, "Large Straight"],
    [/straight truck/i, "Large Straight"],
    [/box truck/i, "Box Truck"],
    [/cargo van/i, "Cargo Van"],
    [/sprinter/i, "Sprinter"],
    [/\bvan\b/i, "Van"],
  ];
  for (const [rx, canonical] of keywordMap) {
    if (rx.test(t)) return canonical;
  }

  return undefined;
}
