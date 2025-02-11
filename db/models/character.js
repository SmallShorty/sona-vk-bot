const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../db');

class Character extends Model {
  // ==== CREATE ====

  /**
   * Создает нового персонажа.
   * @param {Object} characterData - Данные для создания персонажа.
   * @returns {Promise<Character>} Созданный персонаж.
   */
  static createCharacter(characterData) {
    // Здесь можно сразу вернуть промис без await
    return Character.create(characterData);
  }

  // ==== READ ====

  /**
   * Получает всех персонажей в чате.
   * @param {number} chatId - Идентификатор чата.
   * @returns {Promise<Array<Character>>} Список персонажей в чате.
   */
  static getAllCharactersInChat(chatId) {
    return Character.findAll({ where: { chat_id: chatId } });
  }

  /**
   * Получает список персонажей в чате для определённого фандома.
   * @param {number} chatId - Идентификатор чата.
   * @param {number} fandomId - Идентификатор фандома.
   * @returns {Promise<Array<Character>>} Список персонажей для конкретного фандома.
   */
  static getCharactersByFandom(chatId, fandomId) {
    return Character.findAll({
      where: {
        chat_id: chatId,
        fandom_id: fandomId
      }
    });
  }

  /**
   * Получает всех персонажей пользователя в чате.
   * @param {number} chatId - Идентификатор чата.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {Promise<Array<Character>>} Список персонажей пользователя в чате.
   */
  static getCharactersByUser(chatId, userId) {
    return Character.findAll({
      where: {
        chat_id: chatId,
        user_id: userId
      }
    });
  }

  /**
   * Получает главного персонажа пользователя в чате.
   * @param {number} chatId - Идентификатор чата.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {Promise<Character|null>} Главный персонаж пользователя или null.
   */
  static getMainCharacterByUser(chatId, userId) {
    return Character.findOne({
      where: {
        chat_id: chatId,
        user_id: userId,
        is_main: true
      }
    });
  }

  // ==== UPDATE ====

  /**
   * Изменяет значок, фандом или имя персонажа.
   * @param {number} characterId - Идентификатор персонажа.
   * @param {Object} updateData - Данные для обновления.
   * @returns {Promise<Character>} Обновленный персонаж.
   */
  static async updateCharacter(characterId, updateData) {
    // Используем update с возвращением обновленной записи
    const [count, [updatedCharacter]] = await Character.update(updateData, {
      where: { id: characterId },
      returning: true
    });
    if (count === 0) {
      const error = new Error('Персонаж не найден');
      error.name = 'NotFoundError';
      throw error;
    }
    return updatedCharacter;
  }

  /**
   * Удаляет значок и фандом персонажа.
   * @param {number} characterId - Идентификатор персонажа.
   * @returns {Promise<Character>} Обновленный персонаж с удаленными значком и фандомом.
   */
  static async removeIconAndFandom(characterId) {
    const [count, [updatedCharacter]] = await Character.update(
      { icon: null, fandom_id: null },
      { where: { id: characterId }, returning: true }
    );
    if (count === 0) {
      const error = new Error('Персонаж не найден');
      error.name = 'NotFoundError';
      throw error;
    }
    return updatedCharacter;
  }

  // ==== DELETE ====

  /**
   * Удаляет персонажа.
   * @param {number} characterId - Идентификатор персонажа.
   * @returns {Promise<boolean>} Возвращает true, если персонаж был удален.
   */
  static async deleteCharacter(characterId) {
    const count = await Character.destroy({ where: { id: characterId } });
    if (!count) {
      const error = new Error('Персонаж не найден');
      error.name = 'NotFoundError';
      throw error;
    }
    return true;
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
