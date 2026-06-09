const Fandom = require('db/models/fandom');
const r = require('utils/responses');
const validateEnvironment = require('utils/validateEnvironment');
const logger = require('utils/logger');
const wrapCommand = require('utils/wrapCommand');

module.exports = wrapCommand(async (context) => {
  const args = context.text.split(/\s+/).slice(1);
  const chat_id = context.peerId;
  let response = '';

  if (!(await validateEnvironment(context, { requireChat: true }))) return;
  if (args.length > 0 && !(await validateEnvironment(context, { requireAdmin: true }))) return;

  if (args.length === 0) {
    const fandoms = await Fandom.getFandomList(chat_id);
    if (fandoms.length > 0) {
      response = `📝 Список фандомов в конференции:\n` + fandoms
        .map(f => f.name)
        .sort()
        .join('\n');
    } else {
      response = r.format(r.errors.not_found, { detail: ' Чтобы добавить фандом, используйте команду [/фандом добавить]' });
    }
  } else {
    if (args.length < 2 && args[0].toLowerCase() !== 'удалить') {
      response = r.errors.invalid_input;
      return await context.send(response);
    }

    const command = args[0].toLowerCase();
    const fandomName = args.slice(1).join(' ');

    switch (command) {
      case 'добавить':
        try {
          await Fandom.createFandom(chat_id, fandomName);
          response = r.success.added;
        } catch (error) {
          logger.error({ error }, 'error adding fandom');
          response = error.name === 'AlreadyExistsError'
            ? r.format(r.errors.already_exists, { detail: ' Попробуй выбрать другое имя для фандома.' })
            : r.errors.db;
        }
        break;

      case 'изменить':
        if (!fandomName.includes(' , ')) {
          response = r.format(r.errors.invalid_input, { detail: ' Разделите название старого и нового фандома через запятую с двумя пробелами [ , ].' });
          break;
        }
        const [oldName, newName] = fandomName.split(' , ').map(name => name.trim());
        try {
          await Fandom.updateFandom(chat_id, oldName, newName);
          response = r.success.updated;
        } catch (error) {
          logger.error({ error }, 'error editing fandom');
          response = error.name === 'NotFoundError'
            ? r.format(r.errors.not_found, { detail: ' Фандома с таким именем не существует.' })
            : error.name === 'AlreadyExistsError'
              ? r.format(r.errors.already_exists, { detail: ' Фандом с таким именем уже существует.' })
              : r.errors.db;
        }
        break;

      case 'удалить':
        try {
          await Fandom.deleteFandom(chat_id, fandomName);
          response = r.success.deleted;
        } catch (error) {
          logger.error({ error }, 'error deleting fandom');
          response = error.name === 'NotFoundError'
            ? r.format(r.errors.not_found, { detail: ' Фандома с таким именем не существует.' })
            : r.errors.db;
        }
        break;
      default:
        response = r.errors.unknown_command;
        break;
    }
  }

  try {
    await context.send(response);
  } catch (err) {
    logger.error({ err }, 'error sending message');
    await context.send(r.errors.default);
  }
});
