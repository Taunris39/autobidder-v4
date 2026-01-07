// src/bot/state.ts

export type RegState =
  | "idle"
  | "awaiting_location_update"
  | "awaiting_custom_rate";

export interface UserData {
  userId: number;
  name?: string;
  status?: "available" | "busy";
  location?: { lat: number; lon: number };
  lastLocationUpdate?: number;
  currentLoadId?: string;
  state?: RegState;
}

const users = new Map<number, UserData>();

export function getUserData(userId: number): UserData | undefined {
  return users.get(userId);
}

export function setUserData(userId: number, data: Partial<UserData>): void {
  const existing = users.get(userId) ?? { userId };
  users.set(userId, { ...existing, ...data });
}

export function getAllUserData(): UserData[] {
  return Array.from(users.values());
}

export function setUserState(userId: number, state: RegState): void {
  setUserData(userId, { state });
}

export function clearUserState(userId: number): void {
  setUserData(userId, { state: "idle" });
}

export function getUserState(userId: number): RegState {
  return getUserData(userId)?.state ?? "idle";
}
