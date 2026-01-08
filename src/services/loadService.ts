// src/services/loadService.ts

import type { Load } from "../types/types.js";

const loads = new Map<string, Load>();

export function saveLoad(load: Load): void {
  loads.set(load.id, load);
}

export function getLoad(id: string): Load | undefined {
  return loads.get(id);
}

export function getAllLoads(): Load[] {
  return Array.from(loads.values());
}

export function updateLoad(id: string, data: Partial<Load>): void {
  const existing = loads.get(id);
  if (!existing) return;
  loads.set(id, { ...existing, ...data });
}
