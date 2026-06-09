const Character = require('db/models/character');
const r = require('utils/responses');
const validateEnvironment = require('utils/validateEnvironment');
const wrapCommand = require('utils/wrapCommand');

const deleteCharacter = require('./character.delete');
const addCharacter = require('./character.add');
const editCharacter = require('./character.edit');
const generateCharacterList = require("utils/generateCharacterList");

module.exports = wrapCommand(async (context) => {
    const chat_id = context.peerId;
    const [, command, ...payloadParts] = context.text.split(/\s+/);
    const payload = payloadParts.join(' ') || null;
    const idMatch = context.text.match(/id\s*(\d+)/i);
    const args = {
        all: context.text.startsWith('/персонажи'),
        command: command?.toLowerCase() || null,
        payload,
        id: idMatch ? idMatch[1] : null
    };

    if (!(await validateEnvironment(context, { requireChat: true }))) return;
    if (args.id && args.command && !(await validateEnvironment(context, { requireAdmin: true }))) return;

    if (args.all) {
        const characters = args.id
            ? await Character.getCharactersByUser(chat_id, args.id)
            : await Character.getAllCharactersInChat(chat_id);

        if (!characters.length) return context.send(r.errors.not_found);

        return context.send(await generateCharacterList(characters));
    }

    const actions = {
        'добавить': async () => {
            await addCharacter(context, args);
            return r.success.added;
        },
        'изменить': async () => {
            await editCharacter(context, args);
            return r.success.updated;
        },
        'удалить': async () => {
            await deleteCharacter(context, args);
            return r.success.deleted;
        }
    };

    if (args.command in actions) {
        return context.send(await actions[args.command]());
    }
});
