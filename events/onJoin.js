const Chat = require('db/models/chat');
const r = require('utils/responses');
const logger = require('utils/logger');

module.exports = (vk) => {
    vk.updates.on('chat_invite_user', async (context) => {
        try {
            if (context.peerId !== context.senderId) {
                await Chat.create({ id: context.peerId });
            }
            await context.send(r.greetings);
            logger.info({ peerId: context.peerId }, 'new chat added');
        } catch (error) {
            logger.error({ error, peerId: context.peerId }, 'error adding chat');
            context.send(r.errors.db);
        }
    });
};
