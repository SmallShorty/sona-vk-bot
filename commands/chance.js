const messages = [
    { range: [0, 0], messages: [ // Impossible (0%)
        "Ой, нет-нет, этого точно не случится, даже не мечтай!",
        "Это вообще не вариант, забудь об этом!"
    ] },
    { range: [1, 30], messages: [ // Low chance (1% - 30%)
        "Шанс мал, но вдруг... кто знает?",
        "Это как выиграть в лотерею, но всё же шанс есть!",
        "Низкие шансы, но никогда не говори никогда!"
    ] },
    { range: [31, 60], messages: [ // 50/50 (40% - 60%)
        "Полтора шага вперёд, полшага назад, тут как с монеткой — орёл или решка!",
        "Может случиться, а может и нет, всё как на качелях — туда-сюда!"
    ] },
    { range: [61, 90], messages: [ // High chance (70% - 90%)
        "Выглядит как будто всё уже решено, но давай не будем спешить с выводами!",
        "Шансы такие высокие, что можно почти праздновать, но держим кулачки!"
    ] },
    { range: [100, 100], messages: [ // 100% certain
        "Это произойдёт без вариантов!",
        "Гарантированно! Просто жди и наслаждайся моментом!",
        "Столько же процентов понимания. И никакого осуждения."
    ] }
];

module.exports = async (context) => {
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
};
