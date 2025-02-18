const vk = require('../vkClient'); // Подключаем VK API
const responses = require('../data/responses.json');

const validateEnvironment = async (context, { requireChat = false, requireAdmin = false, requireBotAdmin = false } = {}) => {
    if (requireAdmin) requireChat = true;
    if (requireBotAdmin) requireChat = true;

    if (requireChat && !context.isChat) {
        await context.send(responses.errors.chat_only);
        return false;
    }

    if (requireAdmin || requireBotAdmin) {
        try {
            const response = await vk.api.messages.getConversationMembers({
                peer_id: context.peerId
            });

            if (requireBotAdmin) {
                const botId = context.peerId - 2000000000; // ID бота в беседе
                const botMember = response.items.find(item => item.member_id === botId);
                if (!botMember || !botMember.is_admin) {
                    await context.send('У бота нет прав администратора в этой беседе. Пожалуйста, назначьте бота администратором.');
                    return false;
                }
            }

            if (requireAdmin) {
                const userMember = response.items.find(item => item.member_id === context.senderId);
                if (!userMember || !(userMember.is_admin || userMember.is_owner)) {
                    await context.send(responses.errors.permission_denied);
                    return false;
                }
            }
        } catch (error) {
            console.error('[ERR] Ошибка при получении участников беседы:', error);

            if (error.code === 917) {
                await context.send(responses.errors.no_admin_rights);
                return false;
            }

            return false;
        }
    }

    return true;
};

module.exports = validateEnvironment;