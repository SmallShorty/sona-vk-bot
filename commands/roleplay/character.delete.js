const responses = require('../../data/responses.json');
const Character = require('../../db/models/character');
const parsePayload = require('../../utils/parsePayload');
const generateKeyboard = require('../../utils/generateKeyboard');
const askFields = require('../../utils/askFields');

module.exports = async function deleteCharacter(context, args) {
    console.log('удалить')
    const userId = args.id || context.senderId;
    const characters = await Character.getCharactersByUser(context.peerId, userId);
    if (characters.length === 0 || !characters) {
        return await responses.errors.not_found;
    }
    console.log(characters)
    const characterButtons = characters.map(character => ({
        label: character.dataValues.nickname,
        payload: { id: character.dataValues.id }
    }));

    console.log(characterButtons)
    const fields = [
        {
            name: 'character',
            questionText: responses.requests.enter + 'персонажа, которого ходите удалить',
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
    return await Character.deleteCharacter(characterId);
}