const vk = require('../vkClient');

async function isAdmin(peerId, userId) {
    try {
        const response = await vk.api.messages.getConversationMembers({
            peer_id: peerId
        });

        const member = response.items.find(item => item.member_id === userId);

        return member && (member.is_admin || member.is_owner)
    } catch (error) {
        console.error('[ERR] Ошибка при получении участников беседы:', error);
        return false;
    }
}

module.exports = {isAdmin};
