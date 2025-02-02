const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../db'); // Импортируем sequelize

class Fandom extends Model {
  /**
   * Получает список фандомов для заданного чата.
   * @param {number} chatId - Идентификатор чата.
   * @returns {Promise<Array<Fandom>>} Массив фандомов.
   */
  static async getFandomList(chatId) {
    return await Fandom.findAll({ where: { chat_id: chatId } });
  }

  /**
   * Создает новый фандом, если фандом с таким именем (без учета регистра) еще не существует.
   * @param {number} chatId - Идентификатор чата.
   * @param {string} name - Имя фандома.
   * @returns {Promise<Fandom>} Созданный фандом.
   * @throws {Error} Если фандом уже существует, выбрасывается ошибка с именем "AlreadyExistsError".
   */
  static async createFandom(chatId, name) {
    // Приводим имя к нижнему регистру для унификации
    const normalizedName = name.toLowerCase();

    // Проверяем наличие фандома с таким именем в данном чате
    const existing = await Fandom.findOne({
      where: {
        chat_id: chatId,
        name: normalizedName,
      }
    });

    if (existing) {
      const error = new Error('Фандом уже существует');
      error.name = 'AlreadyExistsError';
      throw error;
    }

    return await Fandom.create({
      chat_id: chatId,
      name: normalizedName,
    });
  }
  /**
 * Обновляет имя фандома в заданном чате.
 * @param {number} chatId - Идентификатор чата.
 * @param {string} oldName - Старое имя фандома.
 * @param {string} newName - Новое имя фандома.
 * @returns {Promise<Fandom>} Обновленный фандом.
 * @throws {Error} Если фандом с новым именем уже существует, выбрасывается ошибка с именем "AlreadyExistsError".
 * @throws {Error} Если фандом с указанным старым именем не найден, выбрасывается ошибка с именем "NotFoundError".
 */
  static async updateFandom(chatId, oldName, newName) {
    const normalizedOldName = oldName.toLowerCase();
    const normalizedNewName = newName.toLowerCase();

    const fandom = await Fandom.findOne({
      where: {
        chat_id: chatId,
        name: normalizedOldName,
      }
    });

    if (!fandom) {
      const error = new Error('Фандом не найден');
      error.name = 'NotFoundError';
      throw error;
    }

    const existing = await Fandom.findOne({
      where: {
        chat_id: chatId,
        name: normalizedNewName,
      }
    });

    if (existing) {
      const error = new Error('Фандом с таким именем уже существует');
      error.name = 'AlreadyExistsError';
      throw error;
    }

    fandom.name = newName;
    await fandom.save();

    return fandom;
  }

  /**
   * Удаляет фандом из заданного чата.
   * @param {number} chatId - Идентификатор чата.
   * @param {string} name - Имя фандома.
   * @returns {Promise<boolean>} Возвращает true, если фандом был удален, и false, если не найден.
   * @throws {Error} Если фандом с указанным именем не найден, выбрасывается ошибка с именем "NotFoundError".
   */
  static async deleteFandom(chatId, name) {
    const normalizedName = name.toLowerCase();

    // Поиск фандома для удаления
    const fandom = await Fandom.findOne({
      where: {
        chat_id: chatId,
        name: normalizedName,
      }
    });

    if (!fandom) {
      const error = new Error('Фандом не найден');
      error.name = 'NotFoundError';
      throw error;
    }

    // Удаление фандома
    await fandom.destroy();
    return true;
  }
}

Fandom.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chat_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Fandom',
  tableName: 'Fandom',
  timestamps: false,
});

module.exports = Fandom;
