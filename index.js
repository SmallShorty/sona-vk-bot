const vk = require('./vkClient');
const commands_data = require("./commands/index.json");
const { checkDatabaseConnection } = require('./db/db');
const responses = require("./data/responses.json");
const { hearManager, sessionManager, sceneManager } = require('./managers');
const Chat = require('./db/models/chat');

const prefix = '/';

vk.updates.on('message_new', async (context, next) => {
    console.log(`[LOG] Получено сообщение: "${context.text}" от пользователя ${context.senderId}`);
    await next();
});

vk.updates.on('message_new', sessionManager.middleware);
vk.updates.on('message_new', sceneManager.middleware);
vk.updates.on('message_new', hearManager.middleware);
vk.updates.on('message_new', sceneManager.middlewareIntercept); // Default scene entry handler

vk.updates.on('chat_invite_user', async (context) => {
    try {
        await context.send(responses.greetings);
        if (context.peerId != context.senderId) {
            const chat = await Chat.create({
                id: context.peerId
            });
        }
        console.log(`[LOG] Новая беседа добавлена: ${context.peerId}`);
    } catch (error) {
        console.log(`[ERROR] Произошла ошибка при добавлении беседы ${context.peerId}\n${error}`);
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

        // Подключаем обработчик команды из соответствующей папки и категории
        const handler = require(`./commands/${category}/${commandName}.js`);

        // Создаем регулярные выражения для алиасов
        const regexArray = aliases.map(alias => new RegExp(`^${prefix}${alias}(?=\\s|$)`, 'i'));

        console.log(`\n[INFO] Регистрируем команду: ${prefix}${commandName} из категории ${categoryName}`);
        console.log(`[INFO] Алиасы: ${aliases.join(', ')}`);

        // Регистрируем каждый алиас
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