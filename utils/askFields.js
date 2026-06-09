const logger = require('./logger');

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

                const lowerText = answer.text && answer.text.toLowerCase();

                if (lowerText === 'отмена') {
                    logger.debug({ field: field.name }, 'пользователь отменил ввод');
                    return null;
                }

                if (skippable && (lowerText === 'пропустить' || lowerText === '-')) {
                    logger.debug({ field: field.name }, 'поле пропущено');
                    responses[field.name] = null;
                    break;
                }

                if (validation && !validation(answer)) {
                    continue;
                }

                responses[field.name] = answer.payload ? answer.payload : answer.text;
                break;
            } catch (error) {
                logger.error({ error }, 'ошибка при запросе ответа');
                throw new Error('Ввод был прерван из-за ошибки.');
            }
        }
    }

    return responses;
}

module.exports = askFields;