const vk = require('../vkClient');
const { renderDialogue } = require('../utils/renderDialogue');
const { mentionUser } = require('../utils/getUserInfo');

module.exports = async (context) => {
    if (!context.replyMessage && context.forwards.size === 0) {
        await context.send('Похоже, вы ещё не переслали ни одного сообщения.');
        return;
    }

    const messages = await parseMessage(context.toJSON());
    const buffer = await renderDialogue(messages);
    const mention = await mentionUser(context.senderId);

    if (!buffer || !Buffer.isBuffer(buffer)) {
        console.error('Invalid buffer returned from renderDialogue');
        await context.send('Произошла ошибка при создании изображения.');
        return;
    }

    try {
        const attachment = await vk.upload.messageDocument({
            peer_id: context.peerId,
            source: {
                value: buffer,
                filename: 'screenshot.png',
                contentType: 'image/png',
                contentLength: buffer.length
            }
        });

        await context.send({
            message: `${mention}, Ваш снимок готов!`,
            attachment
        });
    } catch (error) {
        console.error('Ошибка при загрузке или отправке документа:', error);
        await context.send('Произошла ошибка при отправке документа.');
    }
};
