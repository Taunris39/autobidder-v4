// src/types.ts

export interface Quote {
  driverId: number;
  price: number;
}

export type LoadStatus = "new" | "sent" | "quoted" | "assigned" | "expired";

export interface Types {
  id: string;
  rawText: string;
  pickup: any;
  delivery: any;
  miles: number;
  suggestedRate: number | null;
  sentTo: number[];
  quotes: Quote[];
  status: LoadStatus;
}
