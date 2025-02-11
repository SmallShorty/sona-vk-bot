function parsePayload(data, key) {
    // Check if data and nested properties exist
    if (!data || !data.character || !data.character.message || !data.character.message.payload) {
        console.error("[ERR] Некорректные данные для парсинга.");
        return null;
    }

    try {
        // Parse the payload
        const parsedPayload = JSON.parse(data.character.message.payload);
        // Return the value associated with the key, or null if not found
        return parsedPayload[key] || null;
    } catch (error) {
        console.error("[ERR] Ошибка при парсинге JSON:", error);
        return null;
    }
}

module.exports = parsePayload;
