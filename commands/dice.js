const vk = require('..');
const { getUserInfo } = require('../utils/getUserInfo');

module.exports = async (context) => {
    const args = context.text.split(' ', 3);

    if (args.length < 2) {
        return context.send('Используйте команду в формате: /dice [диапазон] [действие1, действие2,...]');
    }

    const range = parseInt(args[1], 10);
    if (isNaN(range) || range < 2 || range > 100) {
        return context.send('Неверный диапазон значений. Укажите число от 2 до 100.');
    }

    const actions = context.text.slice(args[0].length + args[1].length + 2).split(',').map((action) => action.trim()).filter((action) => action.length > 0);

    // Получаем информацию о пользователе
    try {
        const [userInfo] = await getUserInfo(context.senderId); // Extract first user object from array
        let response = `@id${userInfo.id} (${userInfo.first_name} ${userInfo.last_name}), `;

        if (actions.length === 0) {
            const roll = Math.floor(Math.random() * range) + 1;
            response += `результат броска: ${roll}\n`;
        } else {
            response += 'результат бросков: \n';
            const results = actions.map((action) => {
                const roll = Math.floor(Math.random() * range) + 1;
                return { action, roll };
            });
            results.forEach((result) => {
                response += `- ${result.action}: ${result.roll}\n`;
            });
        }

        // Отправляем ответ
        context.send(response);
    } catch (error) {
        console.error('Ошибка при обработке команды /dice:', error);
        context.send('Произошла ошибка при обработке вашего запроса. Попробуйте еще раз.');
    }
};
