async function askFields(context, fields) {
    const responses = {};

    for (const field of fields) {
        const { questionText, keyboard, validation, skippable = false } = field;
        let answer = null;

        while (true) {
            answer = keyboard
                ? await context.question(questionText, { target_id: context.senderId, keyboard })
                : await context.question(questionText, { target_id: context.senderId });

            const lowerText = answer.text && answer.text.toLowerCase();

            if (lowerText === 'отмена') return null;
            if (skippable && ( lowerText === 'пропустить' || lowerText === '-')) {
                responses[field.name] = null;
                break;
            }
            if (validation && !validation(answer)) continue;

            responses[field.name] = answer.payload ? answer.payload : answer.text;
            break;
        }
    }

    return responses;
}

module.exports = askFields;  