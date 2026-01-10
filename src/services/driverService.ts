// src/services/driverService.ts

import { getAllUserData } from "../bot/state.js";
import type { UserLocation } from "../bot/state.js";
import { haversineDistance } from "./distance.js"; // убедись в корректном пути

export interface DriverInfo {
    userId: string;
    name?: string | undefined;
    location: UserLocation;
}

export function getAvailableDrivers(): DriverInfo[] {
    return getAllUserData()
        .filter((u) => u.status === "available" && u.location)
        .map((u) => ({
            userId: u.userId,
            name: u.name,
            location: u.location!,
        }));
}

export function sortDriversByDistance(
    drivers: DriverInfo[],
    loadLocation: { lat: number; lon: number }
): DriverInfo[] {
    return drivers
        .map((d) => ({
            ...d,
            distance: haversineDistance(
                { lat: d.location.lat, lon: d.location.lon },
                { lat: loadLocation.lat, lon: loadLocation.lon }
            ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .map(({ distance, ...rest }) => rest);
}
