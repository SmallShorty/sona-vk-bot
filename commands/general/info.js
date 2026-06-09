const Chat = require('db/models/chat');
const validateEnvironment = require('utils/validateEnvironment');
const responses = require('data/responses.json');
const logger = require('utils/logger');

module.exports = async (context) => {
    let response;
    const args = context.text.split(' ');
    const command = args[1] ? args[1].toLowerCase() : null;

    const chatId = context.peerId;
    const targetUserId = context.senderId;

    if (!(await validateEnvironment(context, { requireAdmin: true }))) return;

    switch (command) {
        case null:
            try {
                response = await Chat.getPinnedMessage(chatId) || responses.errors.not_found;
            } catch (err) {
                logger.error({ err }, 'ошибка в команде info');
                response = responses.errors.db;
            }
            break;
        case 'добавить':
        case 'изменить': {
            const newPinnedMessage = await context.question(
                responses.requests.enter + 'текст для закреплённого сообщения',
                { target_id: targetUserId }
            );
            try {
                await Chat.updatePinnedMessage(chatId, newPinnedMessage.text);
                response = responses.success.updated;
            } catch (err) {
                logger.error({ err }, 'ошибка в команде info');
                response = responses.errors.db;
            }
            break;
        }
        case 'удалить':
            try {
                await Chat.deletePinnedMessage(chatId);
                response = responses.success.deleted;
            } catch (err) {
                logger.error({ err }, 'ошибка в команде info');
                response = responses.errors.db;
            }
            break;
    }
    try {
        await context.send(response);
    } catch (err) {
        logger.error({ err }, 'ошибка при отправке ответа info');
        await context.send(responses.errors.default);
    }
};