const { isAdmin } = require('./isAdmin');
const responses = require('../data/responses.json');

const validateEnvironment = async (context, { requireChat = false, requireAdmin = false } = {}) => {
    if (requireAdmin) requireChat = true;

    if (requireChat && !context.isChat) {
        context.send(responses.errors.chat_only);
        return false;
    };
    const admin = await isAdmin(context.peerId, context.senderId)
    if (!admin){
        context.send(responses.errors.permission_denied);
        return false;
    };
    return true;
};

module.exports = validateEnvironment;