async function askFields(context, fields) {
    const responses = {};

    for (const field of fields) {
        const { questionText, keyboard, validation, skippable = false } = field;
        let answer = null;

        console.log(`Запрашиваем поле: ${field.name}`); // Логируем начало запроса

        while (true) {
            try {
                console.log(`Отправляем вопрос: ${questionText}`); // Логируем отправку вопроса
                answer = keyboard
                    ? await context.question(questionText, { target_id: context.senderId, keyboard })
                    : await context.question(questionText, { target_id: context.senderId });

                console.log(`Получен ответ: ${answer.text}`); // Логируем полученный ответ

                const lowerText = answer.text && answer.text.toLowerCase();

                if (lowerText === 'отмена') {
                    console.log('Пользователь отменил ввод.'); // Логируем отмену
                    return null;
                }

                if (skippable && (lowerText === 'пропустить' || lowerText === '-')) {
                    console.log(`Поле "${field.name}" пропущено.`); // Логируем пропуск
                    responses[field.name] = null;
                    break;
                }

                if (validation && !validation(answer)) {
                    console.log(`Ответ не прошел валидацию: ${answer.text}`); // Логируем ошибку валидации
                    continue;
                }

                responses[field.name] = answer.payload ? answer.payload : answer.text;
                console.log(`Ответ сохранен: ${responses[field.name]}`); // Логируем успешный ответ
                break;
            } catch (error) {
                console.error(`Ошибка при запросе ответа: ${error.message}`); // Логируем ошибку
                throw new Error('Ввод был прерван из-за ошибки.');
            }
        }
    }

    return responses;
}

module.exports = askFields;