const Chat = require('../db/models/chat');
const responses = require('../data/responses.json');

module.exports = (vk) => {
    vk.updates.on('chat_invite_user', async (context) => {
        try {
            if (context.peerId !== context.senderId) {
                await Chat.create({ id: context.peerId });
            }
            await context.send(responses.greetings);
            console.log(`[LOG] Новая беседа добавлена: ${context.peerId}`);
        } catch (error) {
            console.log(`[ERROR] Произошла ошибка при добавлении беседы ${context.peerId}\n${error}`);
            context.send(responses.errors.db);
        }
    });
};
