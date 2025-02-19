const { Keyboard } = require('vk-io');

function generateCallbackKeyboard(buttons, userId, inline = false, oneTime = false) {
    // Инициализируем билдер клавиатуры
    const keyboard = Keyboard.builder();

    if (inline) {
        keyboard.inline();
    }
    if (oneTime) {
        keyboard.oneTime();
    }

    const MAX_BUTTONS_PER_ROW = 5;

    buttons.forEach(({ label, payload = {} }, index) => {
        // При достижении лимита кнопок в строке переходим на новую строку
        if (index !== 0 && index % MAX_BUTTONS_PER_ROW === 0) {
            keyboard.row();
        }

        // Добавляем userId в payload для дальнейшей идентификации
        const buttonPayload = {
            ...payload,
            userId
        };

        // Добавляем callback-кнопку
        keyboard.callbackButton({
            label,
            payload: buttonPayload
        });
    });

    return keyboard;
}

module.exports = generateCallbackKeyboard;
