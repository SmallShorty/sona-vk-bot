const logger = require('utils/logger');

function parsePayload(data, key) {
    if (!data || !data.character || !data.character.message || !data.character.message.payload) {
        return null;
    }

    try {
        const parsedPayload = JSON.parse(data.character.message.payload);
        return parsedPayload[key] || null;
    } catch (error) {
        logger.error({ error }, 'error parsing payload');
        return null;
    }
}

module.exports = parsePayload;
