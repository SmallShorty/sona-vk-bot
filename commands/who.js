const { mentionUser } = require('../utils/getUserInfo');
const vk = require('../vkClient');
const words_data = require("../data/nounsAndAdjectives.json");


function getRandomPair(nouns, adjectives) {
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return { noun: randomNoun, adjective: randomAdjective };
}

function declension(adjective, noun) {
    const lastChar = noun.slice(-1); 

    if (['а', 'я'].includes(lastChar)) {
        return adjective
            .replace(/кий$/, 'кая')
            .replace(/ый$|ий$/, 'ая');
    } else if (['о', 'е'].includes(lastChar)) {
        return adjective
            .replace(/кий$/, 'кое')
            .replace(/ый$|ий$/, 'ое');
    } else {
        
        return adjective;
    }
}

module.exports = async (context) => {
    const action = context.text.substring(context.text.indexOf(' ') + 1).trim();
    const peerId = context.peerId;

    try {
        let response;
        let mention;

        if (action.toLowerCase() === 'я') {
            const { noun, adjective } = getRandomPair(words_data.noun, words_data.adjective);

            const agreedAdjective = declension(adjective, noun);
            response = `${agreedAdjective} ${noun}`;
            mention = await mentionUser(context.senderId);
        } else {
            console.log("Условие 'я' не сработало!");
            console.log(words_data);
            response = action.charAt(0).toLowerCase() + action.slice(1).replace(/\.$/, '');
            const { items } = await vk.api.messages.getConversationMembers({ peer_id: peerId });
            const users = items.filter(user => user.member_id > 0);
            const randomUser = users[Math.floor(Math.random() * users.length)];
            mention = await mentionUser(randomUser.member_id);
        }

        await context.send(`🔍 ${mention} — ${response}.`);

    } catch (error) {
        console.error(error);
        await context.send('Произошла ошибка при обработке вашего запроса. Попробуйте еще раз.');
    }
};