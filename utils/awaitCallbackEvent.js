const vk = require('../vkClient');

/**
 * Ожидает событие message_event и фильтрует его по ID пользователя и дополнительным условиям.
 *
 * @param {Object} context - Контекст исходного сообщения.
 * @param {Function} [filter] - Дополнительная функция фильтра для eventContext.
 * @param {number} [timeout=30000] - Таймаут ожидания события в миллисекундах.
 * @returns {Promise<Object>} - Промис, который резолвится объектом eventContext.
 */
module.exports = async function awaitCallbackEvent(context, filter, timeout = 30000) {
    return new Promise((resolve, reject) => {
        let timeoutId;

        console.log(`[LOG] Ожидаем callback событие от пользователя ${context.senderId}...`);

        // Обработчик события
        const eventHandler = async (eventContext, next) => {
            console.log(`[LOG] Получено событие:`, eventContext);

            if (!context.isOutbox) {
                return;
            }

            // Фильтрация: проверяем, что событие от правильного пользователя
            if (eventContext.userId !== context.senderId) {
                console.log(`[WARN] Событие не от нужного пользователя (ожидался ${context.senderId}, получен ${eventContext.userId})`);
                return;
            }

            // Дополнительная фильтрация, если передана функция filter
            if (filter && typeof filter === 'function' && !filter(eventContext)) {
                console.log(`[WARN] Событие не прошло фильтрацию`);
                return;
            }

            // Отправляем ответ на событие, чтобы прекратить анимацию загрузки на стороне пользователя
            await vk.api.messages.sendMessageEventAnswer({
                event_id: eventContext.eventId,
                user_id: eventContext.userId,
                peer_id: eventContext.peerId
            });
            if (timeoutId) clearTimeout(timeoutId);  // Очищаем таймаут
            console.log('[LOG] Событие прошло фильтрацию, обрабатываем');
            resolve(eventContext);  // Возвращаем обработанные данные
            
            await next();
        };

        // Подписываемся на событие message_event
        vk.updates.on('message_event', eventHandler);
        console.log('[LOG] Подписка на событие message_event установлена');

        // Если событие не происходит в течение заданного времени, отклоняем промис
        if (timeout > 0) {
            timeoutId = setTimeout(() => {
                console.log('[ERROR] Время ожидания события истекло');
                vk.updates.unsubscribe('message_event', eventHandler);  // Отписываемся от события при таймауте
                reject(new Error('Timeout waiting for callback event'));
            }, timeout);
        }
    });
};
