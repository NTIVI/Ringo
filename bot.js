const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// The HTTPs URL where the Next.js app is deployed
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://ringo-umber.vercel.app'; 

bot.start((ctx) => {
  ctx.reply(
    'Добро пожаловать в Ringo! 🍩\nНажми на кнопку ниже, чтобы открыть приложение, собирать монеты и забирать призы!',
    Markup.inlineKeyboard([
      Markup.button.webApp("Открыть игру 🍩", WEB_APP_URL)
    ])
  );
});

bot.launch().then(() => {
  console.log('Ringo Telegram Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
