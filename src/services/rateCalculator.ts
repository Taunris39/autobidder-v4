// === src/services/rateCalculator.ts ===

import { extractRateFromEmail } from "./extractRate.js";

interface LoadLike {
    rawText: string;
    // miles?: number;
    // truckType?: "sprinter" | "small_straight" | "large_straight";
}

interface DriverLike {
    truckType?: "sprinter" | "small_straight" | "large_straight";
}

export function calculateSuggestedRate(
    load: LoadLike,
    driver: DriverLike
): number | null {
    const extracted = extractRateFromEmail(load.rawText);
    if (extracted) return extracted;

    // TODO: позже добавить формулы по типу трака
    switch (driver.truckType) {
        case "sprinter":
        case "small_straight":
        case "large_straight":
        default:
            return null;
    }
}
