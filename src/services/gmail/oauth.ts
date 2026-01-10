// src/services/gmail/oauth.ts

import { google } from "googleapis";
import { loadEnv } from "../../config/env.js";

const env = loadEnv();

export function createOAuth2Client() {
    const {
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        GMAIL_REDIRECT_URI,
        GMAIL_REFRESH_TOKEN,
    } = env;

    if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REDIRECT_URI) {
        throw new Error(
            "GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI must be set"
        );
    }

    const client = new google.auth.OAuth2(
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        GMAIL_REDIRECT_URI
    );

    if (!GMAIL_REFRESH_TOKEN) {
        throw new Error("GMAIL_REFRESH_TOKEN is not set; run OAuth flow to obtain it");
    }

    client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
    return client;
}
