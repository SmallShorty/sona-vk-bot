require('./config/env'); // проверяет обязательные переменные окружения при запуске
const vk = require('./vkClient');
const commands_data = require("./commands/index.json");
const { checkDatabaseConnection } = require('./db/db');
const { hearManager, sessionManager, sceneManager, questionManager } = require('./managers');
const { PREFIX } = require('./config');
const logger = require('./utils/logger');
const path = require('path');
const fs = require('fs');

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
        logger.debug({ file }, 'обработчик загружен');
    }
});

Object.entries(commands_data).forEach(([category, data]) => {
    const { name: categoryName, commands } = data;

    commands.forEach((commandData) => {
        const { name: commandName, wip, aliases } = commandData;
        if (wip) {
            logger.debug({ command: commandName, category: categoryName }, 'команда помечена как WIP, пропускаем');
            return;
        }
        const handler = require(`./commands/${category}/${commandName}.js`);
        const regexArray = aliases.map(alias => new RegExp(`^${PREFIX}${alias}(?=\\s|$)`, 'i'));
        regexArray.forEach((regex) => {
            hearManager.hear(regex, handler);
        });
        logger.debug({ command: commandName, aliases }, 'команда зарегистрирована');
    });
});

checkDatabaseConnection().then(() => {
    vk.updates.start().catch((err) => logger.error({ err }, 'ошибка запуска polling'));
    logger.info('бот запущен');
}).catch(() => {
    logger.error('бот не запущен из-за ошибки базы данных');
});

module.exports = { hearManager, sessionManager, sceneManager };
