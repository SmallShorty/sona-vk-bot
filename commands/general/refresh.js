const Chat = require('../../db/models/chat');
const responses = require('../../data/responses.json');
const wrapCommand = require('../../utils/wrapCommand');

module.exports = wrapCommand(async (context) => {
    const chat = await Chat.create({ id: context.peerId });
    if (chat) return context.send(responses.success.updated);
    return context.send(responses.errors.default);
});
