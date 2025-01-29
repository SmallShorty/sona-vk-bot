const vk = require('./vkClient');
const { HearManager } = require('@vk-io/hear');
const commands_data = require("./commands/commands.json");
const help = require('./commands/help');
const { checkDatabaseConnection } = require('./db/db');

const prefix = '/';

vk.updates.on('message_new', async (context, next) => {
    console.log(`[LOG] Получено сообщение: "${context.text}" от пользователя ${context.senderId}`);
    await next();
});

const hearManager = new HearManager();

Object.entries(commands_data).forEach(([commandName, data]) => {
    if (data.wip) {
        console.log(`\n[INFO] Команда ${prefix}${commandName} помечена как WIP и не будет зарегистрирована.`);
        return;
    }
    
    const handler = require(`./commands/${commandName}.js`);
    
    const regexArray = data.aliases.map(alias => new RegExp(`^${prefix}${alias}(?=\\s|$)`, 'i'));

    console.log(`\n[INFO] Регистрируем команду: ${prefix}${commandName}`);
    console.log(`[INFO] Алиасы: ${data.aliases.join(', ')}`);

    regexArray.forEach((regex, index) => {
        console.log(`  - [INFO] Зарегистрирован алиас: ${prefix}${data.aliases[index]}`);
        hearManager.hear(regex, handler);
    });

    console.log(`[INFO] Команда ${prefix}${commandName} и её алиасы успешно зарегистрированы.\n`);
});

vk.updates.on('message_new', hearManager.middleware);

checkDatabaseConnection().then(() => {
    vk.updates.start().catch(console.error);
    console.log('Бот запущен!');
}).catch(err => {
    console.error('[ERROR] Бот не запущен из-за ошибки базы данных.');
});

module.exports = vk;
