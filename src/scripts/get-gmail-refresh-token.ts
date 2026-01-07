import http from "http";
import { google } from "googleapis";
import open from "open";

// === ВСТАВЬ СВОИ ДАННЫЕ ===
const CLIENT_ID =
  "782380300420-k86mmhvpt582c9a9l8o4vd2tgftfm6l5.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
// ===========================

const PORT = 3000;

async function main() {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  // URL для авторизации
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
    ],
  });

  console.log("\nОткрываю браузер для авторизации...");
  console.log("Если браузер не открылся, перейди по ссылке вручную:\n");
  console.log(authUrl, "\n");

  // Открываем браузер
  await open(authUrl);

  // Запускаем локальный сервер для приёма кода
  const server = http.createServer(async (req, res) => {
    if (!req.url) return;

    if (req.url.startsWith("/oauth2callback")) {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      const code = url.searchParams.get("code");

      if (!code) {
        res.writeHead(400);
        res.end("Не удалось получить code");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Авторизация успешна! Можешь закрыть это окно.</h1>");

      try {
        const { tokens } = await oAuth2Client.getToken(code);

        console.log("\n=== ACCESS TOKEN ===");
        console.log(tokens.access_token);

        console.log("\n=== REFRESH TOKEN ===");
        console.log(tokens.refresh_token);

        console.log("\nСкопируй refresh token и добавь в .env:");
        console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);
      } catch (err) {
        console.error("Ошибка обмена кода на токены:", err);
      }

      server.close();
    }
  });

  server.listen(PORT, () => {
    console.log(`\nСервер запущен: http://localhost:${PORT}`);
    console.log("Ожидаю redirect от Google...");
  });
}

main().catch(console.error);
