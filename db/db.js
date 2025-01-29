const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Отключить логирование SQL запросов
});

const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('[INFO] Успешное подключение к базе данных.');
  } catch (err) {
    console.error('[ERROR] Ошибка подключения к базе данных:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, checkDatabaseConnection };
