const vk = require('./vkClient');
const commands_data = require("./commands/index.json");
const { checkDatabaseConnection } = require('./db/db');
const responses = require("./data/responses.json");
const { hearManager, sessionManager, sceneManager, questionManager } = require('./managers');
const path = require('path');
const fs = require('fs');
const Chat = require('./db/models/chat');

const prefix = '/';

// // Логирование входящих сообщений
// vk.updates.on('message_new', async (context, next) => {
//     console.log(`[LOG] Получено сообщение: "${context.text}" от пользователя ${context.senderId}`);
//     await next();
// });

vk.updates.use(questionManager.middleware);
vk.updates.on('message_new', sessionManager.middleware);
vk.updates.on('message_new', sceneManager.middleware);
vk.updates.on(['message_new'], hearManager.middleware);
vk.updates.on('message_new', sceneManager.middlewareIntercept);

const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach((file) => {
    if (file.endsWith('.js')) {
        const eventHandler = require(path.join(eventsPath, file));
        eventHandler(vk);
        console.log(`[INFO] Обработчик ${file} загружен.`);
    }
});

Object.entries(commands_data).forEach(([category, data]) => {
    const { name: categoryName, commands } = data;

    commands.forEach((commandData) => {
        const { name: commandName, wip, aliases } = commandData;
        if (wip) {
            console.log(`\n[INFO] Команда ${prefix}${commandName} из категории ${categoryName} помечена как WIP и не будет зарегистрирована.`);
            return;
        }
        const handler = require(`./commands/${category}/${commandName}.js`);
        const regexArray = aliases.map(alias => new RegExp(`^${prefix}${alias}(?=\\s|$)`, 'i'));
        console.log(`\n[INFO] Регистрируем команду: ${prefix}${commandName} из категории ${categoryName}`);
        console.log(`[INFO] Алиасы: ${aliases.join(', ')}`);
        regexArray.forEach((regex, index) => {
            console.log(`  - [INFO] Зарегистрирован алиас: ${prefix}${aliases[index]}`);
            hearManager.hear(regex, handler);
        });
        console.log(`[INFO] Команда ${prefix}${commandName} из категории ${categoryName} и её алиасы успешно зарегистрированы.\n`);
    });
});

checkDatabaseConnection().then(() => {
    vk.updates.start().catch(console.error);
    console.log('Бот запущен!');
}).catch(err => {
    console.error('[ERROR] Бот не запущен из-за ошибки базы данных.');
});

module.exports = { hearManager, sessionManager, sceneManager };
