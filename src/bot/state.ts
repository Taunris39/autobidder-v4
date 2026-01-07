// === src/bot/state.ts ===
// — In-memory user state and data store with helper functions.
// — NOTE: For production, replace with persistent storage (Redis/session).

export type RegState =
  | "awaiting_name"
  | "awaiting_unit"
  | "awaiting_location"
  | "awaiting_status"
  | "awaiting_loads";

export type UserStatus = "available" | "busy";

export interface UserData {
  name?: string;
  unit?: string;
  location?: { lat: number; lon: number };
  status?: UserStatus;
}

// — Internal maps (encapsulated)
const userState = new Map<number, RegState>();
const userData = new Map<number, UserData>();
const lastSeen = new Map<number, number>();

// — Get or set helpers

// — Return current state and update lastSeen
export function getUserState(userId: number): RegState | undefined {
  lastSeen.set(userId, Date.now());
  return userState.get(userId);
}

export function setUserState(userId: number, state: RegState): void {
  userState.set(userId, state);
  lastSeen.set(userId, Date.now());
}

export function clearUserState(userId: number): void {
  userState.delete(userId);
  lastSeen.set(userId, Date.now());
}

export function getUserData(userId: number): UserData | undefined {
  lastSeen.set(userId, Date.now());
  return userData.get(userId);
}

// — Merge partial updates into stored user data
export function setUserData(userId: number, data: Partial<UserData>): void {
  const prev = userData.get(userId) ?? {};
  const merged = { ...prev, ...data };
  userData.set(userId, merged);
  lastSeen.set(userId, Date.now());
}

// — Convenience: get or create a user data object
export function getOrCreateUserData(userId: number): UserData {
  const existing = userData.get(userId);
  if (existing) return existing;
  const init: UserData = {};
  userData.set(userId, init);
  lastSeen.set(userId, Date.now());
  return init;
}

export function clearUserData(userId: number): void {
  userData.delete(userId);
  lastSeen.set(userId, Date.now());
}

// — Validate lat/lon ranges
export function isValidLocation(
  loc: { lat: number; lon: number } | null | undefined
): loc is { lat: number; lon: number } {
  if (!loc) return false;
  const { lat, lon } = loc;
  if (typeof lat !== "number" || typeof lon !== "number") return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

// — Cleanup inactive users to avoid memory growth
export function cleanupInactiveUsers(maxAgeMs = 1000 * 60 * 60 * 24) {
  const now = Date.now();
  for (const [userId, ts] of lastSeen.entries()) {
    if (now - ts > maxAgeMs) {
      userData.delete(userId);
      userState.delete(userId);
      lastSeen.delete(userId);
    }
  }
}
