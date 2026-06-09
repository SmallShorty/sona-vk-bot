const generateCharacterList = require("utils/generateCharacterList");
const Character = require("db/models/character");

module.exports = async (context) => {
    const characters = await Character.getAllCharactersInChat(context.peerId);
    const list = await generateCharacterList(characters);
    return context.send(list);
};