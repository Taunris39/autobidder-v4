// src/bot/state.ts
export type RegState =
    | "idle"
    | "awaiting_name"
    | "awaiting_unit"
    | "awaiting_status"
    | "awaiting_location"
    | "awaiting_location_update"
    | "awaiting_custom_rate";

export interface UserLocation {
    lat: number;
    lon: number;
}

export interface UserData {
    userId: string;
    name?: string;
    status?: string;
    unit?: string;
    location?: UserLocation;
    lastLocationUpdate?: number;
    currentLoadId?: string;
    state?: RegState;
}

const users = new Map<string, UserData>();

export function getUserData(userId: string): UserData | undefined {
    return users.get(userId);
}

export function setUserData(userId: string, data: Partial<UserData>): UserData {
    const existing = users.get(userId) ?? { userId, state: "idle" as RegState };
    const updated: UserData = { ...existing, ...data, userId }; // гарантируем userId как string
    users.set(userId, updated);
    return updated;
}

export function getAllUserData(): UserData[] {
    return Array.from(users.values());
}

export function setUserState(userId: string, state: RegState): void {
    setUserData(userId, { state });
}

export function getUserState(userId: string): RegState {
    return getUserData(userId)?.state ?? "idle";
}

export function clearUserState(userId: string): void {
    setUserState(userId, "idle");
}
