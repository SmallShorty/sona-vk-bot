'use strict';
const logger = require('./logger');
const responses = require('../data/responses.json');

/**
 * Оборачивает обработчик команды в стандартный try/catch.
 * Именованные ошибки (NotFoundError, AlreadyExistsError) маппируются
 * в соответствующие строки из responses. Все остальные — на errors.default.
 */
function wrapCommand(handler) {
    return async (context) => {
        try {
            await handler(context);
        } catch (err) {
            logger.error({ err, peerId: context.peerId, senderId: context.senderId }, 'необработанная ошибка команды');

            const errorMap = {
                NotFoundError:      responses.errors.not_found,
                AlreadyExistsError: responses.errors.already_exists,
            };

            const message = errorMap[err.name] || responses.errors.default;
            await context.send(message);
        }
    };
}

module.exports = wrapCommand;
