// src/types/types.ts

export interface Quote {
  driverId: string;
  price: number;
}

export type LoadStatus = "new" | "sent" | "quoted" | "assigned" | "expired";

export interface Load {
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
