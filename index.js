// Fix Windows console encoding for UTF-8 (Cyrillic support)
if (process.platform === 'win32') {
    const { execSync } = require('child_process');
    try {
        execSync('chcp 65001', { stdio: 'ignore' });
    } catch (e) {
        // Silently fail if chcp is not available
    }
}

require('config/env'); // проверяет обязательные переменные окружения при запуске
const vk = require('vkClient');
const { checkDatabaseConnection } = require('db/db');
const { hearManager, sessionManager, sceneManager, questionManager } = require('managers');
const { PREFIX } = require('config');
const logger = require('utils/logger');
const path = require('path');
const fs = require('fs');

const commands_data = JSON.parse(fs.readFileSync(path.join(__dirname, 'commands/index.json'), 'utf8'));

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
        logger.debug({ file }, 'event handler loaded');
    }
});

Object.entries(commands_data).forEach(([category, data]) => {
    const { name: categoryName, commands } = data;

    commands.forEach((commandData) => {
        const { name: commandName, wip, aliases } = commandData;
        if (wip) {
            logger.debug({ command: commandName, category: categoryName }, 'command marked as WIP, skipping');
            return;
        }
        const handler = require(`commands/${category}/${commandName}.js`);
        const regexArray = aliases.map(alias => new RegExp(`^${PREFIX}${alias}(?=\\s|$)`, 'i'));
        regexArray.forEach((regex) => {
            hearManager.hear(regex, handler);
        });
        logger.debug({ command: commandName, aliases }, 'command registered');
    });
});

require('db/associations');

checkDatabaseConnection().then(() => {
    vk.updates.start().catch((err) => logger.error({ err }, 'error starting polling'));
    logger.info('bot started');
}).catch(() => {
    logger.error('bot failed to start due to database error');
});

module.exports = { hearManager, sessionManager, sceneManager };
