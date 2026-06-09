const Chat = require('../../db/models/chat');
const responses = require('../../data/responses.json');
const logger = require('../../utils/logger');

module.exports = async (context) => {
    try {
        const chat = await Chat.create({ id: context.peerId });
        if (chat) return await context.send(responses.success.updated);
        return await context.send(responses.errors.default);
    } catch (error) {
        logger.error({ error }, 'ошибка при обновлении чата')
        return await context.send(responses.errors.db);
    }
};
