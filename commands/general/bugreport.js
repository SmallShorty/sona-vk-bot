const { mentionUser } = require("../../utils/getUserInfo");
const vk = require("../../vkClient");
const crypto = require("crypto");

module.exports = async (context) => {
    const peerId = 2000000003;

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
    } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
        await context.send(
            "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте ещё раз."
        );
    }
};
