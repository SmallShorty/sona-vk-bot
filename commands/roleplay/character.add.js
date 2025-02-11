const responses = require('../../data/responses.json');
const Fandom = require('../../db/models/fandom');
const Character = require('../../db/models/character');
const generateKeyboard = require('../../utils/generateKeyboard');
const askFields = require('../../utils/askFields');
const isEmoji = require('../../utils/isEmoji');

module.exports = async function addCharacter(context, args) {
  const chat_id = context.peerId;
  const available_fandoms = await Fandom.getFandomList(chat_id);
  const fandomButtons = available_fandoms.map(fandom => ({
    label: fandom.dataValues.name,
    payload: { id: fandom.dataValues.id }
  }));
  const fields = [
    {
      name: 'nickname',
      questionText: 'Введите имя персонажа:',
      validation: (input) => input.text.trim().length > 0
    },
    {
      name: 'icon',
      questionText: 'Введите эмодзи для персонажа:',
      skippable: true,
      validation: (input) => isEmoji(input)
    },
    {
      name: 'fandom',
      questionText: 'Выберите фандом:',
      skippable: true,
      keyboard: generateKeyboard(fandomButtons, context.senderId, true)
    }
  ];

  try {
    const characterData = await askFields(context, fields);
    if (!characterData) {
      return await context.send('прерван');
    }


    let fandomId = null;
    if (characterData.fandom) {
      const fandomPayload = characterData.fandom.message.payload;
      try {
        const parsedFandom = JSON.parse(fandomPayload);
        fandomId = parsedFandom.id;
      } catch (e) {
        console.error("[ERR] Ошибка при парсинге JSON:", e);
      }
    }


    return await Character.createCharacter({
      chat_id: chat_id,
      nickname: characterData.nickname?.message?.text,
      icon: characterData.icon ? characterData.icon.message.text : null,
      fandom_id: fandomId,
      user_id: args.id || context.senderId
    });
    
  } catch (error) {
    console.log('[ERR] при заполнение формы персонажа:', error);
    throw Error;
  }
};
