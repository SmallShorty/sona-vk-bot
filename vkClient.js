const { VK } = require('vk-io');
require('dotenv').config(); // Убедитесь, что это есть

const token = process.env.NODE_ENV === 'test' ? process.env.VK_API_TOKEN_TEST : process.env.VK_API_TOKEN;

const vk = new VK({
    token: token,
});

module.exports = vk;