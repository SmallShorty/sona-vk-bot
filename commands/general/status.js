const wrapCommand = require('utils/wrapCommand');

module.exports = wrapCommand(async (context) => {
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);

    await context.send(`✅ Бот в сети!\n⏱ Время работы: ${uptimeHours} ч ${uptimeMinutes} мин ${uptimeSeconds} сек.`);
});
