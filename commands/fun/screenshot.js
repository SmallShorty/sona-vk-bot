const vk = require('../../vkClient');
const { parseMessage } = require('../../utils/parseMessage');
const { renderDialogue } = require('../../utils/renderDialogue');
const { mentionUser } = require('../../utils/getUserInfo');
const logger = require('../../utils/logger');

module.exports = async (context) => {
    if (!context.replyMessage && context.forwards.size === 0) {
        await context.send('Похоже, вы ещё не переслали ни одного сообщения.');
        return;
    }

    const messages = await parseMessage(context.toJSON());
    const buffer = await renderDialogue(messages);
    const mention = await mentionUser(context.senderId);

    if (!buffer || !Buffer.isBuffer(buffer)) {
        logger.error('renderDialogue вернул некорректный buffer');
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
        logger.error({ error }, 'ошибка при загрузке или отправке скриншота');
        await context.send('Произошла ошибка при отправке документа.');
    }
};
