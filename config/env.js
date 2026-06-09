'use strict';
const { cleanEnv, str, port } = require('envalid');

module.exports = cleanEnv(process.env, {
    VK_API_TOKEN:      str({ docs: 'API-токен VK-группы (production)' }),
    VK_API_TOKEN_TEST: str({ default: '', docs: 'API-токен VK-группы (тестовый режим)' }),
    POSTGRES_DB:       str(),
    POSTGRES_USER:     str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_HOST:     str({ default: 'localhost' }),
    POSTGRES_PORT:     port({ default: 5432 }),
});
