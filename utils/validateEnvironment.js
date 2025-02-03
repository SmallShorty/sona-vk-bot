const { isAdmin } = require('./isAdmin');
const responses = require('../data/responses.json');

const validateEnvironment = async (context, { requireChat = false, requireAdmin = false } = {}) => {
    if (requireChat && !context.isChat) {
        return responses.errors.chat_only; // Команда только для чатов
    }

    if (!context.text?.trim()) {
        return responses.errors.invalid_input; // Проверка наличия текста
    }

    if (requireAdmin) {
        const admin = await isAdmin(context.peerId, context.senderId);
        console.log(admin)
        if (!admin) {
            return responses.errors.permission_denied;
        }
    }

    return null;
};

module.exports = validateEnvironment;