const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../db'); // Импортируем sequelize

class Character extends Model {
  /**
   * Создает нового персонажа.
   * @param {Object} characterData - Данные для создания персонажа.
   * @returns {Promise<Character>} Созданный персонаж.
   */
  static async createCharacter(characterData) {
    return await Character.create(characterData);
  }

  /**
   * Получает всех персонажей в чате.
   * @param {number} chatId - Идентификатор чата.
   * @returns {Promise<Array<Character>>} Список персонажей в чате.
   */
  static async getAllCharactersInChat(chatId) {
    return await Character.findAll({
      where: { chat_id: chatId }
    });
  }

  /**
   * Получает список персонажей в чате, принадлежащих определенному фандому.
   * @param {number} chatId - Идентификатор чата.
   * @param {number} fandomId - Идентификатор фандома.
   * @returns {Promise<Array<Character>>} Список персонажей для конкретного фандома.
   */
  static async getCharactersByFandom(chatId, fandomId) {
    return await Character.findAll({
      where: {
        chat_id: chatId,
        fandom_id: fandomId
      }
    });
  }

  /**
   * Получает главного персонажа пользователя в чате.
   * @param {number} chatId - Идентификатор чата.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {Promise<Character|null>} Главный персонаж пользователя или null.
   */
  static async getMainCharacterByUser(chatId, userId) {
    return await Character.findOne({
      where: {
        chat_id: chatId,
        is_main: true,
        user_id: userId
      }
    });
  }

  /**
   * Изменяет значок, фандом или имя персонажа.
   * @param {number} characterId - Идентификатор персонажа.
   * @param {Object} updateData - Данные для обновления.
   * @returns {Promise<Character>} Обновленный персонаж.
   */
  static async updateCharacter(characterId, updateData) {
    const character = await Character.findByPk(characterId);
    if (!character) {
      const error = new Error('Персонаж не найден');
      error.name = 'NotFoundError';
      throw error;
    }
    await character.update(updateData);
    return character;
  }

  /**
   * Удаляет персонажа.
   * @param {number} characterId - Идентификатор персонажа.
   * @returns {Promise<boolean>} Возвращает true, если персонаж был удален.
   */
  static async deleteCharacter(characterId) {
    const character = await Character.findByPk(characterId);
    if (!character) {
      const error = new Error('Персонаж не найден');
      error.name = 'NotFoundError';
      throw error;
    }
    await character.destroy();
    return true;
  }

  /**
   * Удаляет значок или фандом персонажа.
   * @param {number} characterId - Идентификатор персонажа.
   * @returns {Promise<Character>} Обновленный персонаж с удаленными значком и фандомом.
   */
  static async removeIconAndFandom(characterId) {
    const character = await Character.findByPk(characterId);
    if (!character) {
      const error = new Error('Персонаж не найден');
      error.name = 'NotFoundError';
      throw error;
    }
    character.icon = null;
    character.fandom_id = null;
    await character.save();
    return character;
  }
}

Character.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chat_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_main: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fandom_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Character',
  tableName: 'Character',
  timestamps: false,
});

module.exports = Character;
