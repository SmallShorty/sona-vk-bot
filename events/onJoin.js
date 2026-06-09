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
            logger.info({ peerId: context.peerId }, 'new chat added');
        } catch (error) {
            logger.error({ error, peerId: context.peerId }, 'error adding chat');
            context.send(responses.errors.db);
        }
    });
};
