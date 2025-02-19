const Fandom = require('../../db/models/fandom');
const responses = require('../../data/responses.json');
const validateEnvironment = require('../../utils/validateEnvironment')

module.exports = async (context) => {
  const args = context.text.split(/\s+/).slice(1);
  const chat_id = context.peerId;
  let response = '';

  if (!(await validateEnvironment(context, { requireChat: true }))) return;
  if (args.id && args.command && !(await validateEnvironment(context, { requireAdmin: true }))) return;

  if (args.length === 0) {
    const fandoms = await Fandom.getFandomList(chat_id);
    if (fandoms.length > 0) {
      response = `📝 Список фандомов в конференции:\n` + fandoms
        .map(f => f.name)
        .sort()
        .join('\n');
    } else {
      response = `${responses.errors.not_found} Чтобы добавить фандом, используйте команду [/фандом добавить]`;
    }
  } else {
    if (args.length < 2 && args[0].toLowerCase() !== 'удалить') {
      response = responses.errors.invalid_input;
      return await context.send(response);
    }

    const command = args[0].toLowerCase();
    const fandomName = args.slice(1).join(' ');

    switch (command) {
      case 'добавить':
        try {
          await Fandom.createFandom(chat_id, fandomName);
          response = responses.success.added;
        } catch (error) {
          console.error(`[ERROR] Ошибка при добавлении фандома\n${error}`);
          response = error.name === 'AlreadyExistsError'
            ? `${responses.errors.already_exists} Попробуй выбрать другое имя для фандома.`
            : responses.errors.db;
        }
        break;

      case 'изменить':
        if (!fandomName.includes(' , ')) {
          response = responses.errors.invalid_input + ' Разделите название старого и нового фандома через запятую с двумя пробелами [ , ].';
          break;
        }
        const [oldName, newName] = fandomName.split(' , ').map(name => name.trim());
        try {
          await Fandom.updateFandom(chat_id, oldName, newName);
          response = responses.success.updated;
        } catch (error) {
          console.error(`[ERROR] Ошибка при изменении фандома\n${error}`);
          response = error.name === 'NotFoundError'
            ? `${responses.errors.not_found} Фандома с таким именем не существует.`
            : error.name === 'AlreadyExistsError'
              ? `${responses.errors.already_exists} Фандом с таким именем уже существует.`
              : responses.errors.db;
        }
        break;

      case 'удалить':
        try {
          await Fandom.deleteFandom(chat_id, fandomName);
          response = responses.success.deleted;
        } catch (error) {
          console.error(`[ERROR] Ошибка при удалении фандома\n${error}`);
          response = error.name === 'NotFoundError'
            ? `${responses.errors.not_found} Фандома с таким именем не существует.`
            : responses.errors.db;
        }
        break;
      default:
        response = responses.errors.unknown_command;
        break;
    }
  }

  try {
    await context.send(response);
  } catch (err) {
    console.error(`[ERROR] Ошибка при отправке сообщения\n${err}`);
    await context.send(responses.errors.default);
  }
};
