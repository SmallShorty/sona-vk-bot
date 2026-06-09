const responses = require('../../data/responses.json');
const logger = require('../../utils/logger');

const answer = [
    "Бесспорно",
    "Предрешено",
    "Без сомнений",
    "Определённо да",
    "Можешь быть уверен в этом",
    "Мне кажется — «да»",
    "Вероятнее всего",
    "Хорошие перспективы",
    "Знаки говорят — «да»",
    "Да",
    "Пока не ясно, попробуй снова",
    "Спроси позже",
    "Лучше не рассказывать",
    "Сейчас нельзя предсказать",
    "Сконцентрируйся и спроси опять",
    "Даже не думай",
    "Мой ответ — «нет»",
    "По моим данным — «нет»",
    "Перспективы не очень хорошие",
    "Весьма сомнительно"
];

module.exports = async (context) => {
    try {
        context.send( `🎱 Магический шар говорит: ${answer[Math.floor(Math.random() * answer.length)]}`, {
            forward: JSON.stringify({
                peer_id: context.peerId,
                conversation_message_ids: [context.conversationMessageId],
                is_reply: 1,
            })
        });
    } catch (err) {
        logger.error({ err }, 'ошибка magic8ball')
        await context.send(responses.errors.default)
    }
};