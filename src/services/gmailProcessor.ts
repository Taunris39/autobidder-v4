// src/services/gmailProcessor.ts

import { saveLoad } from "./loadService.js";
import { Load } from "../types.js";

export async function processEmail(parsed: {
  id: string;
  rawText: string;
  pickup: any;
  delivery: any;
  miles: number;
}) {
  const load: Load = {
    id: parsed.id,
    rawText: parsed.rawText,
    pickup: parsed.pickup,
    delivery: parsed.delivery,
    miles: parsed.miles,
    suggestedRate: null,
    sentTo: [],
    quotes: [],
    status: "new",
  };

  saveLoad(load);

  return load;
}
