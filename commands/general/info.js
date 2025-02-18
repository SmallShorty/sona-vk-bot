const Chat = require('../../db/models/chat');
const validateEnvironment = require('../../utils/validateEnvironment');
const responses = require('../../data/responses.json');

module.exports = async (context) => {
    const args = context.text.split(' ');
    const command = args[1]?.toLowerCase() || null;
    const chatId = context.peerId;
    const targetUserId = context.senderId;

    if (!(await validateEnvironment(context, { requireAdmin: true }))) return;

    // Функция обработки ошибок
    const handleError = (err) => {
        console.error(`[ERROR] ${err}`);
        return responses.errors.db;
    };

    // Функция обновления закрепленного сообщения
    const updatePinnedMessage = async () => {
        const newMessage = await context.question(
            responses.requests.enter + 'текст для закреплённого сообщения',
            { targetUserId }
        );
        try {
            await Chat.updatePinnedMessage(chatId, newMessage.text);
            return responses.success.updated;
        } catch (err) {
            return handleError(err);
        }
    };

    const commands = {
        null: async () => {
            try {
                const message = await Chat.getPinnedMessage(chatId);
                return message?.trim() ? message : responses.errors.not_found;
            } catch (err) {
                return handleError(err);
            }
        },
        'добавить': updatePinnedMessage,
        'изменить': updatePinnedMessage,
        'удалить': async () => {
            try {
                await Chat.deletePinnedMessage(chatId);
                return responses.success.deleted;
            } catch (err) {
                return handleError(err);
            }
        }
    };

    const response = commands.hasOwnProperty(command) ? await commands[command]() : responses.errors.unknown_command;
    return await context.send(response);
};
