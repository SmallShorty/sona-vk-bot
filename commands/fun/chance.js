const responses = require('../../data/responses.json');
const logger = require('../../utils/logger');
const messages = [
    {
        range: [0, 0], messages: [
            "Ой, нет-нет, этого точно не случится, даже не мечтай!",
            "Это вообще не вариант, забудь об этом!"
        ]
    },
    {
        range: [1, 30], messages: [
            "Шанс мал, но вдруг... кто знает?",
            "Это как выиграть в лотерею, но всё же шанс есть!",
            "Низкие шансы, но никогда не говори никогда!"
        ]
    },
    {
        range: [30, 49], messages: [
            "Шанс есть, но не слишком большой. Надежда умирает последней!",
            "Может сработать, если звёзды сойдутся правильно!",
            "Не самый лучший шанс, но и не худший. Попробуй!"
        ]
    },
    {
        range: [50, 50], messages: [
            "Полтора шага вперёд, полшага назад, тут как с монеткой — орёл или решка!",
            "Может случиться, а может и нет, всё как на качелях — туда-сюда!"
        ]
    },
    {
        range: [51, 70], messages: [
            "Шансы неплохие, но всё ещё есть место для сюрпризов!",
            "Похоже, что всё идёт в правильном направлении!",
            "Не расслабляйся, но успех вполне реален!"
        ]
    },
    {
        range: [71, 80], messages: [
            "Очень похоже, что всё сложится как надо!",
            "Шансы высоки, но чуть-чуть осторожности не помешает!",
            "Почти наверняка, но держим пальцы скрещёнными!"
        ]
    },
    {
        range: [81, 99], messages: [
            "Выглядит как будто всё уже решено, но давай не будем спешить с выводами!",
            "Шансы такие высокие, что можно почти праздновать, но держим кулачки!"
        ]
    },
    {
        range: [100, 100], messages: [
            "Это произойдёт без вариантов!",
            "Гарантированно! Просто жди и наслаждайся моментом!",
            "Столько же процентов понимания. И никакого осуждения."
        ]
    }
];


module.exports = async (context) => {
    try {
        const chance = Math.floor(Math.random() * 101);

        const group = messages.find(({ range }) => chance >= range[0] && chance <= range[1]);

        const randomMessage = group.messages[Math.floor(Math.random() * group.messages.length)];

        const response = `🔮 Шанс: ${chance}%\n${randomMessage}`;

        context.send(response, {
            forward: JSON.stringify({
                peer_id: context.peerId,
                conversation_message_ids: [context.conversationMessageId],
                is_reply: 1,
            })
        });
    } catch (err) {
        logger.error({ err }, 'ошибка chance');
        context.send(responses.errors.default);
    }
};
