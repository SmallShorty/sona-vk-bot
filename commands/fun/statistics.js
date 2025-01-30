const { getUserInfo, mentionUser } = require('../../utils/getUserInfo');
const vk = require('../../vkClient');

module.exports = async (context) => {
    const period = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    let offset = 0;
    const count = 200;
    let allMessages = [];

    while (true) {
        const response = await vk.api.messages.getHistory({
            peer_id: context.peerId,
            offset: offset,
            count: count
        });

        const recentMessages = response.items.filter(msg => msg.date >= period);
        allMessages = allMessages.concat(recentMessages);

        if (response.items.length < count || recentMessages.length < count) {
            break;
        }
        offset += count;
    }

    const userStats = {};

    for (const msg of allMessages) {
        const userId = msg.from_id;

        if (userId < 0) continue;
        const wordCount = msg.text.split(/\s+/).length;

        if (!userStats[userId]) {
            userStats[userId] = { messages: 0, words: 0 };
        }

        userStats[userId].messages += 1;
        userStats[userId].words += wordCount;
    }

    const sortedStats = await Promise.all(
        Object.entries(userStats)
            .sort(([, a], [, b]) => b.messages - a.messages)
            .map(async ([userId, stats], index) => {
                const mention = await mentionUser(userId);
                return `${index + 1}. ${mention} — ${stats.messages} сообщений, ${stats.words} слов`;
            })
    );

    const responseMessage = `Топ участников за последнюю неделю:\n${sortedStats.join('\n')}`;
    await context.send(responseMessage);
};
