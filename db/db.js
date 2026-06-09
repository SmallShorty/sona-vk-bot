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
        logger.info('database synchronized');
    })
    .catch((error) => {
        logger.error({ error }, 'error synchronizing database');
    });

const checkDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('successfully connected to database');
    } catch (err) {
        logger.error({ err }, 'error connecting to database');
        process.exit(1);
    }
};

module.exports = { sequelize, checkDatabaseConnection };
