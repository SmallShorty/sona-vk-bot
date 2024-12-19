// vkClient.js
const { VK } = require('vk-io');

const vk = new VK({
    token: process.env.VK_TOKEN,
});

module.exports = vk;
