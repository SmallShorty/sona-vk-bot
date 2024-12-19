const vk = require('../vkClient');

/**
 * Функция для получения данных о пользователях через метод users.get
 * @param {string|number|Array} userIds - ID пользователей или их screen_names
 * @param {Array} fields - Дополнительные поля, которые нужно получить (например, photo_50, city, country)
 * @param {string} nameCase - Падеж для склонения имени и фамилии (опционально)
 * •именительный – nom,
 * •родительный – gen,
 * •дательный – dat,
 * •винительный – acc,
 * •творительный – ins,
 * •предложный – abl.
 * @returns {Promise<Array>} - Массив с данными пользователей
 */

async function getUserInfo(userIds, fields = [], nameCase = 'nom') {
    try {
        // Проверяем, является ли userIds массивом
        if (!Array.isArray(userIds)) {
            userIds = [userIds];
        }

        // Выполняем запрос к API
        const response = await vk.api.users.get({
            user_ids: userIds,
            fields: fields,
            name_case: nameCase
        });
        return response;
    } catch (error) {
        console.error('Ошибка при получении данных о пользователях:', error);
        throw error;
    }
}

function mentionUser (userInfo){
    return `@id${userInfo.id} (${userInfo.first_name} ${userInfo.last_name})`;
}

module.exports = {
    getUserInfo,
    mentionUser
};