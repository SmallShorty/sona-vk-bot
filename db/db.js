const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,       // Имя базы данных
  process.env.POSTGRES_USER,     // Имя пользователя
  process.env.POSTGRES_PASSWORD, // Пароль
  {
    host: process.env.POSTGRES_HOST || 'localhost', // Хост (IP или доменное имя удаленного сервера)
    port: process.env.POSTGRES_PORT || 5432,        // Порт (по умолчанию 5432)
    dialect: 'postgres',                           // Диалект (PostgreSQL)
    logging: false,                                // Отключение логов запросов
  }
);
sequelize.sync()
    .then(() => {
        console.log('[INFO] База данных синхронизирована.');
    })
    .catch((error) => {
        console.error('[INFO] Ошибка синхронизации базы данных: ', error);
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
