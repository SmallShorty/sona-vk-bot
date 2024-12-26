const { parseMessage } = require('../utils/parseMessage');
const vk = require('../vkClient');

module.exports = async (context) => {
    // console.log(context.toJSON());
    if (!context.replyMessage && context.forwards.size === 0) {
        await context.send('Похоже, вы ещё не переслали ни одного сообщения.');
        return;
    }

    const messages = await parseMessage(context.toJSON());

    console.log(JSON.stringify(messages, null, 2));

    // const buffer = renderDiagloue();

    // // try {
    // //     // Загружаем изображение
    // //     const attachment = await vk.upload.messagePhoto({
    // //         source: {
    // //             value: buffer
    // //         }
    // //     });

    // //     await context.send({
    // //         message: 'Вот ваше изображение:',
    // //         attachment
    // //     });
    // } catch (error) {
    //     console.error('Ошибка при загрузке или отправке изображения:', error);
    //     await context.send('Произошла ошибка при отправке изображения.');
    // }
}