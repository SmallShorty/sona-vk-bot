const vk = require('vkClient');
const r = require('utils/responses');
const { VK_PEER_OFFSET } = require('config');
const logger = require('utils/logger');

const validateEnvironment = async (context, { requireChat = false, requireAdmin = false, requireBotAdmin = false } = {}) => {
    if (requireAdmin) requireChat = true;
    if (requireBotAdmin) requireChat = true;

    if (requireChat && !context.isChat) {
        await context.send(r.errors.chat_only);
        return false;
    }

    if (requireAdmin || requireBotAdmin) {
        try {
            const response = await vk.api.messages.getConversationMembers({
                peer_id: context.peerId
            });

            if (requireBotAdmin) {
                const botId = context.peerId - VK_PEER_OFFSET;
                const botMember = response.items.find(item => item.member_id === botId);
                if (!botMember || !botMember.is_admin) {
                    await context.send(r.errors.no_bot_admin);
                    return false;
                }
            }

            if (requireAdmin) {
                const userMember = response.items.find(item => item.member_id === context.senderId);
                if (!userMember || !(userMember.is_admin || userMember.is_owner)) {
                    await context.send(r.errors.permission_denied);
                    return false;
                }
            }
        } catch (error) {
            logger.error({ error }, 'error getting chat members');

            if (error.code === 917) {
                await context.send(r.errors.no_admin_rights);
                return false;
            }

            return false;
        }
    }

    return true;
};

module.exports = validateEnvironment;