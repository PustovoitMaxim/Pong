const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();

// Проверяем, что токен установлен
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN is not set in environment variables.');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const GAME_URL = 'https://pustovoitmaxim.github.io/telegram-pong-game/'; // Замените на ваш URL

// Разрешаем парсинг JSON в Express
app.use(express.json());

// ==================== КОМАНДЫ БОТА ====================
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

bot.command('play', (ctx) => {
    ctx.reply('Запускаем игру...', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎮 Открыть Pong', web_app: { url: GAME_URL } }]
            ]
        }
    );
});

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
// ==================== КОНЕЦ КОМАНД БОТА ====================

// Настройка Webhook маршрута для Telegram
app.use(bot.webhookCallback('/webhook'));

// Простой маршрут для проверки работоспособности сервера
app.get('/', (req, res) => {
    res.json({ 
        status: 'Pong Bot is running!', 
        timestamp: new Date().toISOString(),
        game_url: GAME_URL
    });
});

// Получаем порт из переменных окружения Render
const PORT = process.env.PORT || 3000;

// Запускаем сервер
app.listen(PORT, async () => {
    console.log(`✅ Bot server is running on port ${PORT}`);
    console.log(`🌐 Webhook path: /webhook`);
    console.log(`🎮 Game URL: ${GAME_URL}`);
    
    // Устанавливаем webhook после запуска сервера
    try {
        const webhookUrl = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/webhook`;
        await bot.telegram.setWebhook(webhookUrl);
        console.log(`✅ Webhook set to: ${webhookUrl}`);
    } catch (error) {
        console.error('❌ Failed to set webhook:', error);
    }
});

// Обработка ошибок бота
bot.catch((err, ctx) => {
    console.error(`❌ Bot error for update ${ctx.update.update_id}:`, err);
});

// Элегантное завершение работы
process.on('SIGTERM', () => {
    console.log('🛑 Bot shutting down...');
    bot.stop();
});
