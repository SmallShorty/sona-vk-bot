const vk = require("../../vkClient");
const generateCharacterList  = require("../../utils/generateCharacterList");

module.exports = async (context) => {
    const list = await generateCharacterList(context.peerId);
    console.log(list)
    return await context.send(list)
}