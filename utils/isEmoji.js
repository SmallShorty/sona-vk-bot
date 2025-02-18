const responses = require('../data/responses.json');

async function extractEmoji(input) {
    const emojiRegex = /^(?:\p{Emoji}(?:\p{Emoji_Modifier}|\uFE0F)?)+$/u;
    return emojiRegex.test(input.text);
}

module.exports = extractEmoji;