import { sequelize } from "../db/db";

const Fandom = sequelize.define('Fandom', {
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
    tableName: 'Fandom',
    timestamps: false,
});