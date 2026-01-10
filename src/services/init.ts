// src/gmail/init.ts
import { registerGmailWatch, unregisterGmailWatch } from "./gmail/watch.js";
import { startMessageFetcher, stopMessageFetcher } from "./gmail/messageFetcher.js";
import { processEmail } from "../gmailProcessor.js";
import { initGmailService as initGmailClient, stopWatch as stopGmailWatch } from "./initClient.js";

/**
 * Централизованная инициализация Gmail-сервисов:
 * - инициализирует gmail client (если требуется),
 * - регистрирует watch,
 * - запускает фетчер сообщений и передаёт обработчик processEmail.
 *
 * Экспортирует init и stop для управления жизненным циклом сервиса.
 */

let initialized = false;

export async function initGmailService(): Promise<void> {
    if (initialized) return;
    console.log("[GMAIL] Starting Gmail service...");

    try {
        // Инициализируем клиент (если у вас есть отдельный модуль initClient)
        // Если у вас нет такого модуля, замените вызов на initGmailService из вашего клиента
        await initGmailClient();

        // Регистрируем watch (подписку на уведомления)
        await registerGmailWatch();
        console.log("[GMAIL] Watch registered");

        // Запускаем фетчер сообщений и передаём обработчик processEmail
        // startMessageFetcher должен принимать callback (messageId) => Promise<void>
        await startMessageFetcher(processEmail);
        console.log("[GMAIL] Message fetcher started");

        initialized = true;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[GMAIL] Failed to start Gmail service:", err);
        throw err;
    }
}

/**
 * Останавливает все фоновые задачи Gmail-сервиса:
 * - останавливает фетчер сообщений,
 * - снимает watch (если применимо),
 * - вызывает дополнительные стоп-хуки.
 */
export async function stopGmailService(): Promise<void> {
    if (!initialized) return;
    console.log("[GMAIL] Stopping Gmail service...");

    try {
        // Остановить фетчер сообщений
        try {
            await stopMessageFetcher();
            console.log("[GMAIL] Message fetcher stopped");
        } catch (err) {
            // eslint-disable-next-line no-console
            console.warn("[GMAIL] Error stopping message fetcher:", err);
        }

        // Снять watch (локально/через API)
        try {
            // Если у вас есть отдельная функция для остановки watch — используем её
            if (typeof unregisterGmailWatch === "function") {
                await unregisterGmailWatch();
                console.log("[GMAIL] Local watch unregistered");
            } else {
                // fallback: попытаться остановить через клиент
                await stopGmailWatch();
                console.log("[GMAIL] Remote watch stopped");
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.warn("[GMAIL] Error stopping watch:", err);
        }
    } finally {
        initialized = false;
    }
}

export default {
    init: initGmailService,
    stop: stopGmailService,
};
