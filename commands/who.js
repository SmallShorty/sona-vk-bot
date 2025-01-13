const {mentionUser } = require('../utils/getUserInfo');
const vk = require('../vkClient');

module.exports = async (context) => {
    const action = context.text.substring(context.text.indexOf(' ') + 1)
    const peerId = context.peerId;

    try {
        const { items } = await vk.api.messages.getConversationMembers({ peer_id: peerId });
        
        const users = items.filter(user => user.member_id > 0);

        const randomUser = users[Math.floor(Math.random() * users.length)];

        const mention = await mentionUser(randomUser.member_id);

        await context.send(`🔍 ${mention} — ${action.charAt(0).toLowerCase() + action.slice(1).replace(/\.$/, '')}.`);

    } catch (error) {
        console.error(error);
        await context.send('Произошла ошибка при обработке вашего запроса. Попробуйте еще раз.');
    }
}