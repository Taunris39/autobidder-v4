// === src/services/rateCalculator.ts ===

// src/services/rateCalculator.ts

import type { UserData } from "../bot/state.js";

/**
 * DriverLike должен принимать структуру UserData
 * или любой другой объект с произвольными полями.
 */
export type DriverLike = UserData | Record<string, unknown>;

/**
 * Пример функции расчёта — оставь свою логику,
 * но сигнатура теперь принимает DriverLike.
 */
export function calculateSuggestedRate(load: any): number {
    // простая заглушка — подставь свою формулу
    const base = typeof load.miles === "number" ? load.miles * 1.2 : 100;
    return Math.round(base);
}
