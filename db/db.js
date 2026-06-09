const { Sequelize } = require('sequelize');
const logger = require('utils/logger');

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

sequelize.sync()
    .then(() => {
        logger.info('база данных синхронизирована');
    })
    .catch((error) => {
        logger.error({ error }, 'ошибка синхронизации базы данных');
    });

const checkDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('подключение к базе данных успешно');
    } catch (err) {
        logger.error({ err }, 'ошибка подключения к базе данных');
        process.exit(1);
    }
};

module.exports = { sequelize, checkDatabaseConnection };
