async function askFields(context, fields) {
    const responses = {};

    for (const field of fields) {
        const { questionText, keyboard, validation, skippable = false } = field;
        let answer = null;

        while (true) {
            try {
                answer = keyboard
                    ? await context.question(questionText, { target_id: context.senderId, keyboard })
                    : await context.question(questionText, { target_id: context.senderId });

                console.log(`Получен ответ: ${answer.text}`); 

                const lowerText = answer.text && answer.text.toLowerCase();

                if (lowerText === 'отмена') {
                    console.log('Пользователь отменил ввод.'); 
                    return null;
                }

                if (skippable && (lowerText === 'пропустить' || lowerText === '-')) {
                    console.log(`Поле "${field.name}" пропущено.`); 
                    responses[field.name] = null;
                    break;
                }

                if (validation && !validation(answer)) {
                    console.log(`Ответ не прошел валидацию: ${answer.text}`); 
                    continue;
                }

                responses[field.name] = answer.payload ? answer.payload : answer.text;
                break;
            } catch (error) {
                console.error(`Ошибка при запросе ответа: ${error.message}`); 
                throw new Error('Ввод был прерван из-за ошибки.');
            }
        }
    }

    return responses;
}

module.exports = askFields;