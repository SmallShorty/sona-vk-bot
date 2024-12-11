module.exports = async (context) => {
    try {
        // Получение времени работы бота
        const uptime = process.uptime();
        const uptimeHours = Math.floor(uptime / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);

        // Ответ пользователю
        await context.send(`✅ Бот в сети!\n⏱ Время работы: ${uptimeHours} ч ${uptimeMinutes} мин ${uptimeSeconds} сек.`);
    } catch (error) {
        console.error('Ошибка проверки статуса:', error);
        await context.send('❌ Произошла ошибка при проверке статуса бота.');
    }
};