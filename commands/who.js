const { mentionUser } = require('../utils/getUserInfo');
const vk = require('../vkClient');
const words_data = require("../data/nounsAndAdjectives.json");
const axios = require('axios');

function getRandomPair(nouns, adjectives) {
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return { noun: randomNoun, adjective: randomAdjective };
}

async function getAdjectiveGenders(adjective) {
    try {
        const response = await axios.get('https://ws3.morpher.ru/russian/genders', {
            params: {
                s: adjective,
                format: 'json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при запросе к API (getAdjectiveGenders):', error);
    }
}

async function getNounGender(noun) {
    try {
        const response = await axios.get('http://htmlweb.ru/api/service/sex', {
            params: {
                sex: noun,
                html: true,
                nolimit: true
            }
        });
        return response.data
    } catch (error) {
        console.error('Ошибка при запросе к API (getNounGender):', error);
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
            const gender = await getNounGender(noun);
            const adjectiveGenders = await getAdjectiveGenders(adjective);

            if (!adjectiveGenders || !gender) {
                throw new Error('Не удалось получить данные для согласования.');
            }

            let agreedAdjective;
            switch (gender) {
                case 'Ж':
                    agreedAdjective = adjectiveGenders.feminine;
                    break;
                case '-':
                    agreedAdjective = adjectiveGenders.neuter;
                    break;
                default:
                    agreedAdjective = adjective;
                    break;
            }
            response = `${agreedAdjective} ${noun}`;
            mention = await mentionUser(context.senderId);
        } else {
            response = action.charAt(0).toLowerCase() + action.slice(1).replace(/\.$/, '');
            const { items } = await vk.api.messages.getConversationMembers({ peer_id: peerId });
            const users = items.filter(user => user.member_id > 0);
            const randomUser = users[Math.floor(Math.random() * users.length)];
            mention = await mentionUser(randomUser.member_id);
        }

        await context.send(`🔍 ${mention} — ${response}.`);

    } catch (error) {
        await context.send('Произошла ошибка при обработке вашего запроса. Попробуйте еще раз.');
    }
};
