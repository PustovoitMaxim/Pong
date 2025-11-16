const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Замените на ваш токен

const bot = new Telegraf(BOT_TOKEN);

// Обслуживаем статические файлы игры
app.use(express.static(path.join(__dirname, 'pong-game'))); // Папка с собранной игрой

// Основная страница с игрой
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pong-game', 'index.html'));
});

// Команда /start
bot.start((ctx) => {
    ctx.reply(
        '🎮 Добро пожаловать в Pong Game!\n\n' +
        'Играйте в классический пинг-понг прямо в Telegram!\n\n' +
        'Чтобы начать игру, нажмите кнопку ниже:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎮 Играть в Pong', web_app: { url: `https://your-domain.com/` } }]
                ]
            }
        }
    );
});

// Команда /play
bot.command('play', (ctx) => {
    ctx.reply(
        'Запуск игры Pong...',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎮 Открыть игру', web_app: { url: `https://your-domain.com/` } }]
                ]
            }
        }
    );
});

// Команда /help
bot.help((ctx) => {
    ctx.reply(
        '🎮 Pong Game Bot\n\n' +
        'Команды:\n' +
        '/start - Начать работу с ботом\n' +
        '/play - Запустить игру\n' +
        '/help - Помощь\n\n' +
        'Управление в игре:\n' +
        'Левая ракетка: W/S\n' +
        'Правая ракетка: Стрелки вверх/вниз'
    );
});

// Запускаем бота
bot.launch().then(() => {
    console.log('Bot started');
});

// Запускаем веб-сервер
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Элегантное завершение работы
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));