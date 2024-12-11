require('dotenv').config();
const { VK } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const hearManager = require('./hearManager'); 

// Инициализация VK API
const vk = new VK({
    token: process.env.VK_TOKEN,
});

// Middleware для логирования входящих сообщений
vk.updates.on('message_new', async (context, next) => {
    console.log(`[LOG] Получено сообщение: "${context.text}" от пользователя ${context.senderId}`);
    await next(); // Продолжаем обработку
});



// Подключение обработчиков к VK
vk.updates.on('message_new', hearManager.middleware);

// Запуск бота
vk.updates.start().catch(console.error);

console.log('Бот запущен!');