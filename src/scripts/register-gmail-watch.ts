import { registerGmailWatch } from "../services/gmail/watch.js";
import { logger } from "../utils/logger.js";

async function main() {
  try {
    logger.info("Запуск Gmail watch регистрации...");
    const res = await registerGmailWatch();
    logger.info("Gmail watch успешно зарегистрирован:");
    console.log(res);
  } catch (err) {
    logger.error("Ошибка при регистрации Gmail watch:", err);
  }
}

main();
