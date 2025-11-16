const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();

// Проверяем токен
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN is not set');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const GAME_URL = 'https://pustovoitmaxim.github.io/Pong-game/';

// Middleware
app.use(express.json());

// Команда /start
bot.start((ctx) => {
    ctx.reply('🎮 Добро пожаловать в Pong Game!', {
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: '🎮 Играть в Pong', 
                        web_app: { url: GAME_URL } 
                    }
                ]
            ]
        }
    });
});

// Команда /play
bot.command('play', (ctx) => {
    ctx.reply('Запускаем игру...', {
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: '🎮 Открыть Pong', 
                        web_app: { url: GAME_URL } 
                    }
                ]
            ]
        }
    });
});

// Команда /help
bot.help((ctx) => {
    ctx.reply('Используйте /start для начала игры');
});

// Webhook route
app.use(bot.webhookCallback('/webhook'));

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'Bot is running!',
        service: 'Pong Game Bot'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🎮 Game URL: ${GAME_URL}`);
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
});


