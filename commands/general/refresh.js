const Chat = require('db/models/chat');
const r = require('utils/responses');
const wrapCommand = require('utils/wrapCommand');

module.exports = wrapCommand(async (context) => {
    const chat = await Chat.create({ id: context.peerId });
    if (chat) return context.send(r.success.updated);
    return context.send(r.errors.default);
});
