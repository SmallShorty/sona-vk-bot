const Fandom = require('../../db/models/fandom');
const Character = require('../../db/models/character');
const responses = require('../../data/responses.json');
const generateKeyboard = require('../../utils/generateKeyboard');
const askFields = require('../../utils/askFields');
const parsePayload = require('../../utils/parsePayload');

module.exports = async function editCharacter(context, args) {
    const [target, ...contentParts] = args.payload.trim().split(/\s+/);
    const content = contentParts.join(' ');

    if (!content) {
        return context.send(responses.errors.invalid_input + ' Не забудьте указать, на что вы хотите изменить.');
    }

    const userId = args.id || context.senderId;
    const characters = await Character.getCharactersByUser(context.peerId, userId);

    if (!characters.length) {
        return context.send(responses.errors.not_found);
    }

    // Генерация клавиатуры выбора персонажа
    const characterButtons = characters.map(({ id, nickname }) => ({
        label: nickname,
        payload: { id }
    }));

    const characterData = await askFields(context, [
        {
            name: 'character',
            questionText: responses.requests.enter + ' персонажа, которого хотите изменить',
            keyboard: generateKeyboard(characterButtons, context.senderId, true, true)
        }
    ]);

    if (!characterData?.character) {
        return context.send(responses.errors.default);
    }

    const characterId = parsePayload(characterData, 'id');
    const updateData = {};

    switch (target) {
        case "имя":
            updateData.nickname = content;
            break;
        case "значок":
            updateData.icon = content;
            break;
        case "фандом":
            const fandomRecord = await Fandom.findOne({
                attributes: ['id'],
                where: { name: content, chat_id: context.peerId }
            });
            if (!fandomRecord) {
                return context.send(responses.errors.not_found_fandom);
            }
            updateData.fandom_id = fandomRecord.id;
            break;
        default:
            return context.send(responses.errors.invalid_input);
    }
};
