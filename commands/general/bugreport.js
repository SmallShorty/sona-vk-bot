const { mentionUser } = require("utils/getUserInfo");
const vk = require("vkClient");
const crypto = require("crypto");
const responses = require('data/responses.json');
const { BUG_REPORT_PEER_ID } = require('config');

module.exports = async (context) => {
    const peerId = BUG_REPORT_PEER_ID;

    const report = context.text.includes(" ")
        ? context.text.substring(context.text.indexOf(" ") + 1)
        : null;

    const forwardMessages = context.forwards.map((forward) => forward.id);

    if (forwardMessages.length === 0) {
        await context.send(
            "Пожалуйста, перешлите сообщения, где произошла ошибка. Это поможет нам быстрее разобраться."
        );
        return;
    }

    try {
        const mention = await mentionUser(context.senderId);

        const message = `Пользователь: ${mention}\n${report ? `Сообщение: ${report}` : ""}`;

        await vk.api.messages.send({
            peer_id: peerId,
            message: message,
            forward_messages: forwardMessages.join(","),
            random_id: crypto.randomInt(1, 2_000_000_000),
        });
    } catch (_error) {
        await context.send(responses.errors.default);
    }
};
