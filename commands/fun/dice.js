require('../../utils/stringExtensions');
const { getUserInfo } = require('../../utils/getUserInfo');

const getRoll = (range, advantage = null) => {
    const roll1 = Math.floor(Math.random() * range) + 1;
    if (advantage == null ) {
        return { result : roll1 }
    }
    const roll2 = Math.floor(Math.random() * range) + 1;
    return { roll1, roll2, result: advantage ? Math.max(roll1, roll2) : Math.min(roll1, roll2) };
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
            .split(/,|\n/) 
            .map(action => action.trim())
            .filter(Boolean);
    } else {
        actions = context.text.slice(args[0].length + 1)
            .split(/,|\n/) 
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
        let roll1, roll2, result;
        let hasAdvantage = false;
        let hasDisadvantage = false;
    
        if (action.includes('с помехой') || action.startsWith('-')) {
            hasDisadvantage = true;
            action = action.replace('с помехой', '').replace(/^-/, '').trim();
        } else if (action.includes('с преимуществом') || action.startsWith('+')) {
            hasAdvantage = true;
            action = action.replace('с преимуществом', '').replace(/^\+/, '').trim();
        }
    
        if (hasDisadvantage || hasAdvantage) {
            ({ roll1, roll2, result } = getRoll(range, hasAdvantage));
        } else {
            result = getRoll(range).result;
        }
    
        const emoji = result === range ? '💥' : result === 1 ? '💀' : '🎲';
    
        if (roll1 !== undefined && roll2 !== undefined) {
            response += `${emoji} ${action.capital()}: [${roll1}, ${roll2}] -> ${result}\n`;
        } else {
            response += `${emoji} ${action.capital()}: ${result}\n`;
        }
    });

    context.send(response);
};