'use strict';

const _data = require('data/responses.json');

function format(template, vars = {}) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
        Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : ''
    );
}

function request(type, field, skippable = false) {
    const base = format(_data.requests[type], { field });
    return skippable ? base + _data.requests.skip : base;
}

module.exports = { ..._data, format, request };
