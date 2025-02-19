const Chat = require('../../db/models/chat')
const responses = require('../../data/responses.json');

module.exports = async (context) => {
    try {
        const chat = await Chat.create({ id: context.peerId });
        if (chat) return await context.send(responses.success.updated);
        return await await context.send(responses.errors.default);
    } catch (error) {
        console.log(`[ERR] ${error}`)
        return await context.send(responses.errors.db);
    }
};
