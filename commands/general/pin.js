const vk = require("vkClient");
const Chat = require("db/models/chat");
const Character = require("db/models/character");
const responses = require("data/responses.json");
const generateCharacterList = require("utils/generateCharacterList");
const logger = require("utils/logger");
const wrapCommand = require("utils/wrapCommand");

module.exports = wrapCommand(async (context) => {
    let pinnedMessage = await Chat.getPinnedMessage(context.peerId) || responses.errors.not_found;
    const characters = await Character.getAllCharactersInChat(context.peerId);

    if (characters.length !== 0) {
        pinnedMessage += '\n\n' + await generateCharacterList(characters);
    }

    const sentMessageId = await vk.api.messages.send({
        peer_id: context.peerId,
        message: pinnedMessage,
        random_id: Math.floor(Math.random() * 1000000)
    });

    try {
        await vk.api.messages.pin({
            peer_id: context.peerId,
            message_id: sentMessageId
        });
    } catch (error) {
        logger.error({ error }, 'failed to pin message');
    }
});
