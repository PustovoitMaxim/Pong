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
const GAME_URL = 'https://pustovoitmaxim.github.io/pong-game/';

// Middleware
app.use(express.json());

// Логируем все входящие сообщения
bot.use((ctx, next) => {
    console.log('📨 Received update:', {
        update_id: ctx.update.update_id,
        type: ctx.updateType,
        from: ctx.from?.id,
        chat: ctx.chat?.id,
        text: ctx.message?.text,
        data: ctx.callbackQuery?.data
    });
    return next();
});

// Команда /start
bot.start((ctx) => {
    console.log('🎯 Start command received from user:', ctx.from.id);
    
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

// Обработка callback query (нажатие кнопок)
bot.on('callback_query', (ctx) => {
    console.log('🔘 Callback query received:', ctx.callbackQuery.data);
    ctx.answerCbQuery();
});

// Обработка web app data (если используется)
bot.on('web_app_data', (ctx) => {
    console.log('📱 Web app data received:', ctx.webAppData);
});

// Webhook route с логированием
app.use((req, res, next) => {
    console.log('🌐 Webhook request:', {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body
    });
    next();
});

app.use(bot.webhookCallback('/webhook'));

// Health check
app.get('/', (req, res) => {
    console.log('🏥 Health check received');
    res.json({ 
        status: 'Bot is running!',
        service: 'Pong Game Bot',
        timestamp: new Date().toISOString()
    });
});

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error('❌ Bot error:', {
        error: err.message,
        stack: err.stack,
        update: ctx.update
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🎮 Game URL: ${GAME_URL}`);
    console.log(`📝 Logging enabled - check Render logs for details`);
});
