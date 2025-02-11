const { Keyboard } = require('vk-io');

function generateKeyboard(buttons, userId, inline = false, oneTime = false) {
    // Initialize the keyboard builder with inline and oneTime options
    const keyboard = Keyboard.builder();

    // Set the inline and oneTime properties
    if (inline) {
        keyboard.inline();
    }
    if (oneTime) {
        keyboard.oneTime();
    }

    const MAX_BUTTONS_PER_ROW = 5;
    let currentRow = 0;

    buttons.forEach(({ label, payload = {}, color = 'primary' }, index) => {
        if (index % MAX_BUTTONS_PER_ROW === 0 && index !== 0) {
            keyboard.row();
            currentRow++;
        }

        const buttonPayload = {
            ...payload,
            userId
        };

        keyboard.textButton({
            label,
            payload: buttonPayload,
            color
        });
    });

    return keyboard;
}

module.exports = generateKeyboard;
