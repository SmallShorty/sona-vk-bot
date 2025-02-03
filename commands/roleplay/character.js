const Fandom = require('../../db/models/fandom');
const Character = require('../../db/models/character');
const responses = require('../../data/responses.json');
const validateEnvironment = require('../../utils/validateEnvironment')

module.exports = async (context) => {
    const args = {
        all: context.text.startsWith('/перс'),
        command: (context.text.split(' ')[1] && !context.text.split(' ')[1].includes('id')) ? context.text.split(' ')[1].toLowerCase() : null,
        id: (context.text.includes('id') ? parseInt(context.text.slice(context.text.indexOf('id') + 2).replace(/\D.*$/, ''), 10) : null)
    };

    if (await validateEnvironment(context, { requireChat: true })) return await context.send(responses.errors.chat_only);
    if (args.all) {
        if (await validateEnvironment(context, { requireAdmin: true })) {
            return await context.send(responses.errors.permission_denied)
        } else {
            return await context.send('список')   
        }
    }

    
}