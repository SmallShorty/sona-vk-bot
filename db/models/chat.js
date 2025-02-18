const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Chat extends Model {

    static async getPinnedMessage(chatId) {
        console.log('Ищем чат с ID:', chatId);
        const chat = await this.findByPk(chatId);
        console.log('Найденный чат:', chat);
        return chat ? chat.pinned_message_context : null;
    }


    static async updatePinnedMessage(chatId, pinnedMessageContext) {
        const chat = await this.findByPk(chatId);
        if (chat) {
            chat.pinned_message_context = pinnedMessageContext;
            await chat.save();
            return chat;
        }
        return null;
    }

    static async deletePinnedMessage(chatId) {
        const chat = await this.findByPk(chatId);
        if (chat) {
            chat.pinned_message_context = null;
            await chat.save();
            return chat;
        }
        return null;
    }
}

Chat.init({
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    pinned_message_context: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Chat',
    tableName: 'Chat',
    timestamps: false,
});

module.exports = Chat;