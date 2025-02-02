const Chat = require('../../db/models/chat');
const responses = require('../../data/responses.json');
const { hearManager, sessionManager, sceneManager } = require('../../managers');
const { StepScene } = require('@vk-io/scenes');

module.exports = async (context) => {
    const args = context.text.split(' ');
    const command = args[1] ? args[1].toLowerCase() : null;
    const chat_id = context.peerId;
    let response = '';

    switch (command) {
        case null:
            try {
                response = await Chat.getPinnedMessage(chat_id) || responses.errors.not_found;
            } catch (err) {
                console.log(`[ERR] ${err}`);
                response = responses.errors.db;
            }
            break;
        case 'добавить':
        case 'изменить':
            context.scene.enter('change_pin');
        break;
        case 'удалить':
            try {
                await Chat.deletePinnedMessage(chat_id);
                response = responses.success.deleted;
            } catch (err) {
                console.log(`[ERR] ${err}`);
                response = responses.errors.db;
            }
            break;
        default:
            response = responses.errors.unknown_command;
            break;
    }

    try {
        await context.send(response);
    } catch (err) {
        console.log(`[ERR] ${err}`);
        await context.send(responses.errors.default);
    }
};

// sceneManager.addScenes([
//     new StepScene('changвывыe_pin', [
//         (context) => {
//             if (context.scene.step.firstTime || !context.text) {
//                 return context.send(responses.requests.default + 'текст сообщения, которое нужно закрепить.');
//             }

//             context.scene.state.content = context.text;

//             return context.scene.step.next();
//         },
//         async (context) => {
//             const { content } = context.scene.state;
//             let response;
//             try {
//                 const existingPinnedMessage = await Chat.getPinnedMessage(chat_id);
//                 console.log('exists',existingPinnedMessage);

//                 if (existingPinnedMessage) {
//                     await Chat.updatePinnedMessage(chat_id, content);
//                     response = responses.success.updated;
//                 } else {
//                     await Chat.createPinnedMessage(chat_id, content);
//                     response = responses.success.added;
//                 }

//                 context.send(response);
//             } catch (err) {
//                 console.log(`[ERR] ${err}`);
//                 context.send(responses.errors.db);
//             }

//             return context.scene.step.next();
//         }
//     ]),
// ]);

// sceneManager.addScenes([
//     new StepScene('change_pin', [
//         (context) => {
//             if (context.scene.step.firstTime || !context.text) {
//                 return context.send('What\'s your name?');
//             }

//             console.log('test');

//             context.scene.state.firstName = context.text;

//             return context.scene.step.next();
//         },
//         (context) => {
//             console.log('test');
//             if (context.scene.step.firstTime || !context.text) {
//                 return context.send('How old are you?');
//             }

//             context.scene.state.age = Number(context.text);

//             return context.scene.step.next();
//         },
//         async (context) => {
//             const { firstName, age } = context.scene.state;

//             await context.send(`👤 ${firstName} ${age} ages`);

//             return context.scene.step.next(); // Automatic exit, since this is the last scene
//         }
//     ])
// ]);