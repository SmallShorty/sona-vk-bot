const Chat = require('db/models/chat');
const validateEnvironment = require('utils/validateEnvironment');
const r = require('utils/responses');
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
                response = await Chat.getPinnedMessage(chatId) || r.format(r.errors.not_found);
            } catch (err) {
                logger.error({ err }, 'error in info command');
                response = r.errors.db;
            }
            break;
        case 'добавить':
        case 'изменить': {
            const newPinnedMessage = await context.question(
                r.request('enter', 'текст для закреплённого сообщения'),
                { target_id: targetUserId }
            );
            try {
                await Chat.updatePinnedMessage(chatId, newPinnedMessage.text);
                response = r.success.updated;
            } catch (err) {
                logger.error({ err }, 'error in info command');
                response = r.errors.db;
            }
            break;
        }
        case 'удалить':
            try {
                await Chat.deletePinnedMessage(chatId);
                response = r.success.deleted;
            } catch (err) {
                logger.error({ err }, 'error in info command');
                response = r.errors.db;
            }
            break;
    }
    try {
        await context.send(response);
    } catch (err) {
        logger.error({ err }, 'error sending info response');
        await context.send(r.errors.default);
    }
};