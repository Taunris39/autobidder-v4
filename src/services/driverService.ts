// src/services/driverService.ts

import { getAllUserData } from "../bot/state.js";
import type { UserLocation } from "../bot/state.js";

export interface DriverInfo {
    userId: number;
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
            distance: Math.sqrt(
                Math.pow(d.location.lat - loadLocation.lat, 2) +
                Math.pow(d.location.lon - loadLocation.lon, 2)
            ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .map((d) => ({
            userId: d.userId,
            name: d.name,
            location: d.location,
        }));
}
