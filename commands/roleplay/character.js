const Fandom = require('../../db/models/fandom');
const Character = require('../../db/models/character');
const responses = require('../../data/responses.json');
const validateEnvironment = require('../../utils/validateEnvironment')

const deleteCharacter = require('./character.delete');
const addCharacter = require('./character.add');
const editCharacter = require('./character.edit');
const generateCharacterList = require("../../utils/generateCharacterList");

module.exports = async (context) => {
    const chat_id = context.peerId;

    const args = {
        all: context.text.startsWith('/персонажи'),
        command: (context.text.split(' ')[1] && !context.text.split(' ')[1].includes('id')) ? context.text.split(' ')[1].toLowerCase() : null,
        id: (context.text.includes('id') ? parseInt(context.text.slice(context.text.indexOf('id') + 2).replace(/\D.*$/, ''), 10) : null)
    };

    if (!await validateEnvironment(context, { requireChat: true })) return;
    if (args.id && args.command && !await validateEnvironment(context, { requireAdmin: true })) return;

    try {
        if (args.all) {
            const characters = args.id 
                ? await Character.getCharactersByUser(chat_id, args.id) 
                : await Character.getAllCharactersInChat(chat_id);
        
            if (characters.length == 0 ) {
                return await context.send(responses.errors.not_found);
            }
                const list = await generateCharacterList(characters);
            return await context.send(list);
        }
        switch (args.command) {
            case 'добавить':
                await addCharacter(context, args);
                return await context.send(responses.success.added);
            case 'изменить':
                console.log(args);
                await editCharacter(context, args);
            case 'удалить':
                await deleteCharacter(context, args);
                return context.send(responses.success.deleted);
        }


    } catch (err) {
        console.log('[ERR] ', err)
        return context.send(responses.errors.default);
    }


}