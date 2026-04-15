const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN || '8451460910:AAHuBOCukK2Y9W5BisA0-8wKSQParqdGO14');

// The HTTPs URL where the Next.js app is deployed
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://ringo-umber.vercel.app';

bot.start((ctx) => {
  ctx.reply(
    'Привет! Добро пожаловать в Ringo — элитный кликер пончиков. 🍩✨\n\nНажимай на кнопку ниже, чтобы открыть приложение и начать зарабатывать!',
    Markup.inlineKeyboard([
      [Markup.button.webApp('Открыть Ringo 💍', WEB_APP_URL)]
    ])
  );
});

bot.launch().then(() => {
  console.log('Ringo Telegram Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
