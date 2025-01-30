const vk = require('./vkClient');
const { HearManager } = require('@vk-io/hear');
const commands_data = require("./commands/index.json"); // Путь к файлу JSON
const { checkDatabaseConnection } = require('./db/db');

const prefix = '/';

vk.updates.on('message_new', async (context, next) => {
    console.log(`[LOG] Получено сообщение: "${context.text}" от пользователя ${context.senderId}`);
    await next();
});

const hearManager = new HearManager();

// Проходим по категориям и командам
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

vk.updates.on('message_new', hearManager.middleware);

checkDatabaseConnection().then(() => {
    vk.updates.start().catch(console.error);
    console.log('Бот запущен!');
}).catch(err => {
    console.error('[ERROR] Бот не запущен из-за ошибки базы данных.');
});

module.exports = vk;
