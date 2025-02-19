// utils/awaitCallbackEvent.js
const vk = require('../vkClient');

/**
 * Ожидает событие нажатия callback-кнопки и возвращает eventContext.
 * Фильтрует события по ID пользователя (context.senderId) и по дополнительному фильтру.
 *
 * @param {Object} context - Контекст исходного сообщения.
 * @param {Function} [filter] - Дополнительная функция-фильтр для eventContext. Должна вернуть true, если событие подходит.
 * @param {number} [timeout=30000] - Таймаут ожидания в миллисекундах (по умолчанию 30 секунд).
 * @returns {Promise<Object>} - Промис, который резолвится объектом eventContext.
 */
module.exports = async function awaitCallbackEvent(context, filter, timeout = 30000) {
    return new Promise((resolve, reject) => {
        let timeoutId;

        const handler = (eventContext) => {
            // Проверяем, что событие пришло от того же пользователя, который инициировал команду
            if (eventContext.userId !== context.senderId) {
                return;
            }

            // Если передан дополнительный фильтр, проверяем событие
            if (typeof filter === 'function' && !filter(eventContext)) {
                return;
            }

            // Событие прошло фильтрацию — удаляем обработчик и очищаем таймаут
            vk.updates.off('message_event', handler);
            if (timeoutId) clearTimeout(timeoutId);
            resolve(eventContext);
        };

        // Подписываемся на событие message_event
        vk.updates.on('message_event', handler);

        // Если событие не произошло за заданное время, отклоняем промис
        if (timeout > 0) {
            timeoutId = setTimeout(() => {
                vk.updates.off('message_event', handler);
                reject(new Error('Timeout waiting for callback event'));
            }, timeout);
        }
    });
};
