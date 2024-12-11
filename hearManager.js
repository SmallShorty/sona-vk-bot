const fs = require('fs');
const path = require('path');
const { HearManager } = require('@vk-io/hear');

const hearManager = new HearManager();

// Путь к папке с командами
const commandsPath = path.join(__dirname, 'commands');

// Чтение всех файлов в папке `commands`
fs.readdirSync(commandsPath).forEach((file) => {
    // Получаем полный путь к файлу
    const filePath = path.join(commandsPath, file);

    // Проверяем, является ли файл JavaScript файлом
    if (file.endsWith('.js')) {
        // Импорт команды
        const command = require(filePath);

        // Генерируем команду из имени файла
        const commandName = file.replace('.js', '');

        // Регистрируем команду в HearManager
        hearManager.hear(`!${commandName}`, command);
        console.log(`Команда !${commandName} зарегистрирована`);
    }
});

module.exports = hearManager;
