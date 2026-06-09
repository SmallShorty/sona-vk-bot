'use strict';
const logger = require('utils/logger');
const r = require('utils/responses');

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
            logger.error({ err, peerId: context.peerId, senderId: context.senderId }, 'unhandled command error');

            const errorMap = {
                NotFoundError:      r.errors.not_found,
                AlreadyExistsError: r.errors.already_exists,
            };

            const message = errorMap[err.name] || r.errors.default;
            await context.send(message);
        }
    };
}

module.exports = wrapCommand;
