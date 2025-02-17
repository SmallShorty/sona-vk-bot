const Fandom = require('../../db/models/fandom');
const Character = require('../../db/models/character');
const responses = require('../../data/responses.json');
const parsePayload = require('../../utils/parsePayload');
const generateKeyboard = require('../../utils/generateKeyboard');
const askFields = require('../../utils/askFields');

module.exports = async function editCharacter(context, args) {
    if (!args.payload) {
        return await context.send(responses.errors.invalid_input)
    }
    const userId = args.id || context.senderId;
    const characters = await Character.getCharactersByUser(context.peerId, userId);
    if (characters.length === 0 || !characters) {
        return await responses.errors.not_found;
    }
    const characterButtons = characters.map(character => ({
        label: character.dataValues.nickname,
        payload: { id: character.dataValues.id }
    }));
    const fields = [
        {
            name: 'character',
            questionText: responses.requests.enter + 'персонажа, которого хотите изменить',
            keyboard: generateKeyboard(characterButtons, context.senderId, true, true)
        }
    ]
    const characterData = await askFields(context, fields);
    if (!characterData) {
        return responses.errors.default;
    }
    const characterId = parsePayload(characterData, 'id');
    if (!characterId) {
        throw Error
    }

    console.log(characterId);

    switch (args.payload) {
        case "имя":
            const nickname = await context.question('имя', { target_id: context.senderId });
            await Character.updateCharacter(characterId, { nickname });
            break;
    }

    return await context.send(responses.success.updated);
}