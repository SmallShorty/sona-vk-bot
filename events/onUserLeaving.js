const Chat = require('../db/models/chat');
const responses = require('../data/responses.json');

module.exports = (vk) => {
    vk.updates.on('message_new', async (context) => {
        if (context.isChat && context.action) {
            if (context.action.type === 'chat_kick_user') {
                const userId = context.action.member_id;
                try {
                    const characters = await Character.getCharactersByUser(context.peerId, userId);
                    for (const character of characters) {
                        await Character.deleteCharacter(character.id);
                        console.log(`[LOG] Персонаж ${character.nickname} пользователя ${userId} удален из чата ${context.peerId}`);
                    }
                    context.send(responses.success.deleted + '. Все персонажи пользователя удалены.');
                } catch (error) {
                    console.log(`[ERROR] Ошибка при удалении персонажей: ${error.message}`);
                    context.send(responses.errors.db + 'Произошла ошибка при удалении персонажей. Пожалуйста, повторите позже.');
                }
            }
        }
    });
};
