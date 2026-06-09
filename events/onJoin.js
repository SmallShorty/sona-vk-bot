const Chat = require('db/models/chat');
const responses = require('data/responses.json');
const logger = require('utils/logger');

module.exports = (vk) => {
    vk.updates.on('chat_invite_user', async (context) => {
        try {
            if (context.peerId !== context.senderId) {
                await Chat.create({ id: context.peerId });
            }
            await context.send(responses.greetings);
            logger.info({ peerId: context.peerId }, 'новая беседа добавлена');
        } catch (error) {
            logger.error({ error, peerId: context.peerId }, 'ошибка при добавлении беседы');
            context.send(responses.errors.db);
        }
    });
};
