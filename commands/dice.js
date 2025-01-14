require('../utils/stringExtensions');
const vk = require('..');
const { getUserInfo } = require('../utils/getUserInfo');

const getRoll = (range, hasDisadvantage = false) => {
    const roll1 = Math.floor(Math.random() * range) + 1;
    const roll2 = hasDisadvantage ? Math.floor(Math.random() * range) + 1 : null;
    return { roll1, roll2, result: hasDisadvantage ? Math.min(roll1, roll2) : roll1 };
};

module.exports = async (context) => {
    const args = context.text.split(/\s+/);
    let range = 20;
    let actions = [];
    let response = '';

    try {
        const [userInfo] = await getUserInfo(context.senderId);
        response = `@id${userInfo.id} (${userInfo.first_name} ${userInfo.last_name}), `;
    } catch (error) {
        return context.send('Произошла ошибка при обработке вашего запроса. Попробуйте еще раз.');
    }

    if (args.length >= 2 && !isNaN(parseInt(args[1], 10))) {
        range = parseInt(args[1], 10);
        if (range < 2 || range > 100) {
            return context.send('Неверный диапазон значений. Укажите число от 2 до 100.');
        }

        actions = context.text.slice(args[0].length + args[1].length + 2)
            .split(/,|\n/) // Разделяем по запятой или новой строке
            .map(action => action.trim())
            .filter(Boolean);
    } else {
        actions = context.text.slice(args[0].length + 1)
            .split(/,|\n/) // Разделяем по запятой или новой строке
            .map(action => action.trim())
            .filter(Boolean);
    }

    if (actions.length === 0) {
        const { result } = getRoll(range);
        const emoji = result === range ? '💥' : result === 1 ? '💀' : '🎲';
        return context.send(response + `результат броска: ${result} ${emoji}`);
    }

    response += `результат броск${actions.length <= 1 ? 'а' : 'ов'}: \n`;

    actions.forEach((action) => {
        const hasDisadvantage = action.includes('с помехой') || action.startsWith('!');
        const cleanedAction = hasDisadvantage ? action.replace('с помехой', '').replace(/^!/, '').trim() : action;
        const { roll1, roll2, result } = getRoll(range, hasDisadvantage);

        const emoji = result === range ? '💥' : result === 1 ? '💀' : '🎲';

        response += hasDisadvantage
            ? `${emoji} ${cleanedAction.capital()}: [${roll1}, ${roll2}] -> ${result}\n`
            : `${emoji} ${cleanedAction.capital()}: ${result}\n`;
    });

    context.send(response);
};