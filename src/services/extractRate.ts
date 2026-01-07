// === src/services/extractRate.ts ===

export function extractRateFromEmail(text: string): number | null {
    const patterns = [
        /\b(?:rate|pay|offer|price|amount)\s*[:\-]?\s*\$?(\d{2,5})(?:\.\d{2})?\b/i,
        /\$?(\d{2,5})(?:\.\d{2})?\s*(?:flat|all in|usd)\b/i,
        /\$?(\d{2,5})(?:\.\d{2})?\b/
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (!match) continue;

        const raw = match[1];
        const rate = Number(raw);
        if (Number.isFinite(rate) && rate > 0 && rate < 10000) {
            return rate;
        }
    }

    return null;
}
