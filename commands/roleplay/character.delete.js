const r = require('utils/responses');
const Character = require('db/models/character');
const parsePayload = require('utils/parsePayload');
const generateKeyboard = require('utils/generateKeyboard');
const askFields = require('utils/askFields');

module.exports = async function deleteCharacter(context, args) {
    const userId = args.id || context.senderId;
    const characters = await Character.getCharactersByUser(context.peerId, userId);
    if (characters.length === 0 || !characters) {
        return context.send(r.errors.not_found);
    }
    const characterButtons = characters.map(character => ({
        label: character.dataValues.nickname,
        payload: { id: character.dataValues.id }
    }));
    const fields = [
        {
            name: 'character',
            questionText: r.request('enter', 'персонажа, которого хотите удалить'),
            keyboard: generateKeyboard(characterButtons, context.senderId, true, true)
        }
    ]
    const characterData = await askFields(context, fields);
    if (!characterData) {
        return context.send(r.errors.default);
    }
    const characterId = parsePayload(characterData, 'id');
    if (!characterId) {
        throw new Error('Не удалось определить персонажа');
    }
    return await Character.deleteCharacter(characterId);
}