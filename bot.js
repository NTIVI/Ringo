const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("Please add BOT_TOKEN to your .env file!");
  process.exit(1);
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000'; // Replace with ngrok or deployed URL

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Welcome to YourWin Casino! 🎰\n\nClick the button below to start playing.', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Launch Casino 🎲',
            web_app: { url: WEBAPP_URL }
          }
        ]
      ]
    }
  });
});

console.log("Bot is running... Listening for /start");
