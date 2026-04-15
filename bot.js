const { Telegraf, Markup } from 'telegraf';
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// The HTTPs URL where the Next.js app is deployed or accessed via ngrok.
// Example: https://my-ringo-app.vercel.app or https://<your_ngrok_id>.ngrok-free.app
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://google.com'; 

bot.start((ctx) => {
  ctx.reply(
    'Welcome to Ringo Donut Clicker! 🍩\nTap the button below to start collecting coins and winning real prizes!',
    Markup.inlineKeyboard([
      Markup.button.webApp("Let's Play Ringo! 🍩", WEB_APP_URL)
    ])
  );
});

bot.launch().then(() => {
  console.log('Ringo Telegram Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
