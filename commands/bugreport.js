const { mentionUser } = require('../utils/getUserInfo');
const vk = require('../vkClient');
const crypto = require('crypto');

module.exports = async (context) => {
    const peerId = 2000000003;

    console.log(context);


    const forwardMessages = context.forwards.map(forward => forward.id);


    if (forwardMessages.length === 0) {
        await context.send('Похоже, перешлите несколько сообщений, где произошла ошибка.');
        return;
    }

    console.log(mentionUser(context.senderId))

    try {
        await vk.api.messages.send({
            peer_id: peerId,
            message: `@${context.senderId}`,
            forward_messages: forwardMessages.join(','),
            random_id: crypto.randomInt(1, 2_000_000_000)
        });
        console.log('Сообщение успешно отправлено');
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
    }
};
