const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN;
const GAME_URL = 'https://PustovoitMaxim.github.io/telegram-pong-game/'; // ЗАМЕНИТЕ на ваш URL

// Проверяем наличие токена
if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN not found in environment variables');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Middleware для парсинга JSON
app.use(express.json());

// Команда /start
bot.start((ctx) => {
    ctx.reply(
        '🎮 Добро пожаловать в Pong Game!\n\n' +
        'Классический пинг-понг прямо в Telegram!\n\n' +
        'Управление:\n' +
        '👈 Левая ракетка: W/S\n' +
        '👉 Правая ракетка: Стрелки ▲/▼',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎮 Играть в Pong', web_app: { url: GAME_URL } }]
                ]
            }
        }
    );
});

// Команда /play
bot.command('play', (ctx) => {
    ctx.reply('Запускаем игру...', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎮 Открыть Pong', web_app: { url: GAME_URL } }]
            ]
        }
    );
});

// Команда /help
bot.help((ctx) => {
    ctx.reply(
        '🎮 Pong Game Bot\n\n' +
        'Команды:\n' +
        '/start - Начать работу\n' +
        '/play - Запустить игру\n' +
        '/help - Помощь\n\n' +
        'Игра откроется прямо в Telegram!'
    );
});

// Настройка webhook
app.use(await bot.createWebhook({ path: '/webhook' }));

// Корневой маршрут для проверки работы
app.get('/', (req, res) => {
    res.json({ 
        status: 'Bot is running!',
        service: 'Pong Game Bot',
        timestamp: new Date().toISOString()
    });
});

// Получаем порт из переменных окружения Render
const PORT = process.env.PORT || 3000;

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`✅ Bot server is running on port ${PORT}`);
    console.log(`🌐 Webhook path: /webhook`);
    console.log(`🎮 Game URL: ${GAME_URL}`);
});

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error('❌ Bot error:', err);
});

process.on('SIGTERM', () => {
    console.log('🛑 Bot shutting down...');
    bot.stop();
});

