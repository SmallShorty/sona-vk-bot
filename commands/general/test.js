const vk = require("../../vkClient");
const { Keyboard } = require('vk-io');

module.exports = async (context) => {
    await context.send({
        message: 'Нажмите кнопку:',
        keyboard: Keyboard.builder()
            .callbackButton({
                label: 'Нажми меня',
                payload: { command: 'button_clicked' }
            })
            .oneTime()
    });
}

// vk.updates.on('message_event', async (context) => {
//     if (context.eventPayload.command === 'button_clicked') {
//         await vk.api.messages.sendMessageEventAnswer({
//             event_id: context.eventId,
//             user_id: context.userId,
//             peer_id: context.peerId,
//             event_data: JSON.stringify({
//                 type: 'show_snackbar',
//                 text: 'Кнопка нажата!'
//             })
//         });
//     }
// });