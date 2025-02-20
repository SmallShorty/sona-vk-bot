const responses = require('../../data/responses.json');
const Character = require('../../db/models/character');
const parsePayload = require('../../utils/parsePayload');
const generateKeyboard = require('../../utils/generateKeyboard');
const askFields = require('../../utils/askFields');
const generateCallbackKeyboard = require('../../utils/generateCallbackKeyboard');

module.exports = async function deleteCharacter(context, args) {
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
            questionText: responses.requests.enter + 'персонажа, которого ходите удалить',
            keyboard: generateCallbackKeyboard(characterButtons, context.senderId, true, true)
        }
    ]
    const data = await askFields(context, fields);
    if (!data) {
        return responses.errors.default;
    }
    return await Character.deleteCharacter(data.character.id);
}