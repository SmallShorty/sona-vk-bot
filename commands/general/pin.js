const vk = require("../../vkClient");
const Chat = require('../../db/models/chat');
const validateEnvironment = require('../../utils/validateEnvironment')
const responses = require('../../data/responses.json')

module.exports = async (context) => {
    let response;
    try {
        const pinned = {
            id: Math.floor(Math.random() * 1000000),
            text: await Chat.getPinnedMessage(chatId) || responses.errors.not_found
        }
        const response = await vk.api.messages.send({
            peer_id: context.peerId,
            message: pinned.text,
            random_id: pinned.id
        });

        try {
            await vk.api.messages.pin({
                peer_id: context.peerId,
                conversation_message_id: pinned.id
              });
        } catch (error) {
            console.log(`[ERR] ${err}`);
            response = responses.errors.db;
        }

      } catch (error) {
        console.log(`[ERR] ${err}`);
        response = responses.errors.db;
      }
}