const vk = require("../../vkClient");
const Chat = require("../../db/models/chat");
const Character = require("../../db/models/character");
const responses = require("../../data/responses.json");
const generateCharacterList = require("../../utils/generateCharacterList");

module.exports = async (context) => {
    try {
        let pinnedMessage = await Chat.getPinnedMessage(context.peerId) || responses.errors.not_found;
        const messageId = Math.floor(Math.random() * 1000000);
        const characters = await Character.getAllCharactersInChat(context.peerId);

        if (characters.length !== 0) {
            pinnedMessage += '\n\n' + await generateCharacterList(characters);
        }

        await vk.api.messages.send({
            peer_id: context.peerId,
            message: pinnedMessage,
            random_id: messageId
        });

        try {
            await vk.api.messages.pin({
                peer_id: context.peerId,
                conversation_message_id: messageId
            });
        } catch (error) {
            console.error(`[ERR] Не удалось закрепить сообщение: ${error}`);
        }
    } catch (error) {
        console.error(`[ERR] Sending message failed: ${error}`);
        await context.send(responses.errors.default);
    }
};
