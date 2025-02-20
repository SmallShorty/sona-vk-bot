const awaitCallbackEvent = require('../utils/awaitCallbackEvent');

async function askFields(context, fields) {
    const responses = {};

    for (const field of fields) {
        const { name, questionText, keyboard, validation, skippable = false } = field;
        let validAnswer = false;

        while (!validAnswer) {
            try {
                // Если задана клавиатура, предполагаем, что ответ через callback
                if (keyboard) {
                    // Отправляем сообщение с клавиатурой для выбора
                    await context.send({
                        message: questionText,
                        keyboard
                    });
                    console.log(`[LOG] Сообщение с callback-клавиатурой отправлено для поля "${name}"`);

                    // Ожидаем событие callback от нужного пользователя
                    const event = await awaitCallbackEvent(context, (eventContext) => {
                        // Можно добавить фильтрацию по payload или типу кнопки
                        console.log('[DEBUG] Получен event в фильтре:', eventContext);
                        return eventContext.userId === context.senderId;  // Фильтруем по ID пользователя
                    });

                    console.log('[DEBUG] Данные callback-кнопки:', event);

                    // Сохраняем полученный payload как ответ
                    responses[name] = event.eventPayload;
                    validAnswer = true;
                } else {
                    // Если клавиатура не задана, запрашиваем текстовый ответ
                    const answer = await context.question(questionText, { target_id: context.senderId });
                    console.log(`[LOG] Получено сообщение: "${answer.text}" от пользователя ${context.senderId}`);

                    const lowerText = answer.text?.toLowerCase();

                    if (lowerText === 'отмена') {
                        console.log('[LOG] Пользователь отменил ввод.');
                        return null;
                    }

                    if (skippable && (lowerText === 'пропустить' || lowerText === '-')) {
                        console.log(`[LOG] Поле "${name}" пропущено.`);
                        responses[name] = null;
                        validAnswer = true;
                        continue;
                    }

                    // Проверка валидации текстового ответа
                    if (validation && !validation(answer)) {
                        console.log(`[WARN] Ответ не прошел валидацию: "${answer.text}"`);
                        continue;
                    }

                    responses[name] = answer.text;
                    validAnswer = true;
                }
            } catch (error) {
                console.error(`[ERROR] Ошибка при запросе ответа для поля "${name}": ${error.message}`);
                throw new Error('Ввод был прерван из-за ошибки.');
            }
        }
    }

    return responses;
}

module.exports = askFields;
