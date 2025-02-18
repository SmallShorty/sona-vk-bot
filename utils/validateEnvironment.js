const vk = require('../vkClient'); // Подключаем VK API
const responses = require('../data/responses.json');

const validateEnvironment = async (context, { requireChat = false, requireAdmin = false, requireBotAdmin = false } = {}) => {
    if (requireAdmin) requireChat = true;
    if (requireBotAdmin) requireChat = true;

    // Проверка, что команда вызвана в беседе
    if (requireChat && !context.isChat) {
        await context.send(responses.errors.chat_only);
        return false;
    }

    // Проверка прав администратора и доступа бота
    if (requireAdmin || requireBotAdmin) {
        try {
            // Получаем список участников беседы
            const response = await vk.api.messages.getConversationMembers({
                peer_id: context.peerId
            });

            // Проверка прав бота
            if (requireBotAdmin) {
                const botId = context.peerId - 2000000000; // ID бота в беседе
                const botMember = response.items.find(item => item.member_id === botId);
                if (!botMember || !botMember.is_admin) {
                    await context.send('У бота нет прав администратора в этой беседе. Пожалуйста, назначьте бота администратором.');
                    return false;
                }
            }

            // Проверка прав пользователя
            if (requireAdmin) {
                const userMember = response.items.find(item => item.member_id === context.senderId);
                if (!userMember || !(userMember.is_admin || userMember.is_owner)) {
                    await context.send(responses.errors.permission_denied);
                    return false;
                }
            }
        } catch (error) {
            console.error('[ERR] Ошибка при получении участников беседы:', error);

            // Обработка ошибки "У бота нет доступа"
            if (error.code === 917) {
                await context.send('У бота нет прав администратора в этой беседе. Пожалуйста, назначьте бота администратором.');
                return false;
            }

            return false;
        }
    }

    return true;
};

module.exports = validateEnvironment;