const Chat = require('../../db/models/chat');
const validateEnvironment = require('../../utils/validateEnvironment')
const responses = require('../../data/responses.json')

module.exports = async (context) => {
    let response;
    const args = context.text.split(' ');
    const command = args[1] ? args[1].toLowerCase() : null;

    const chatId = context.peerId;
    const targetUserId = context.senderId;


    const invalidEnv = await validateEnvironment(context, { requireChat: true, requireAdmin: true });
    if (invalidEnv) { response = invalidEnv } else {
        switch (command) {
            case null:
                try {
                    response = await Chat.getPinnedMessage(chatId) || responses.errors.not_found;
                } catch (err) {
                    console.log(`[ERR] ${err}`)
                    response = responses.errors.db;
                }
                break;
            case 'добавить':
            case 'изменить':
                const newPinnedMessage = await context.question(
                    responses.requests.enter + 'текст для закреплённого сообщения',
                    { targetUserId }
                );
                try {
                    await Chat.updatePinnedMessage(chatId, newPinnedMessage.text);
                    response = responses.success.updated;
                } catch (err) {
                    console.log(`[ERR] ${err}`);
                    response = responses.errors.db;
                }

                break;
            case 'удалить':
                try {
                    await Chat.deletePinnedMessage(chatId)
                    response = responses.success.deleted;
                } catch (err) {
                    console.log(`[ERR] ${err}`)
                    response = responses.errors.db;
                }
                break
        }
    };
    try {
        await context.send(response);
    } catch (err) {
        console.error(`[ERROR] Ошибка при отправке сообщения\n${err}`);
        await context.send(responses.errors.default);
    }
};
