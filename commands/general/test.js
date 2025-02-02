const { Keyboard } = require('vk-io');
const vk = require("../../vkClient");
const { sceneManager } = require('../../managers');
const { StepScene } = require('@vk-io/scenes');

module.exports = async (context) => {
    console.log('context.scene:', context.scene);
    await context.send('Please enter your name:');
    if (context.scene) {
        context.scene.enter('signup');
    } else {
        await context.send('Ошибка: сцена не инициализирована.');
    }
};

sceneManager.addScenes([
    new StepScene('signup', [
        (context) => {
            if (context.scene.step.firstTime || !context.text) {
                return context.send('What\'s your name?');
            }

            context.scene.state.firstName = context.text;

            return context.scene.step.next();
        },
        (context) => {
            if (context.scene.step.firstTime || !context.text) {
                return context.send('How old are you?');
            }

            context.scene.state.age = Number(context.text);

            return context.scene.step.next();
        },
        async (context) => {
            const { firstName, age } = context.scene.state;

            await context.send(`👤 ${firstName} ${age} ages`);

            return context.scene.step.next(); // Automatic exit, since this is the last scene
        }
    ])
]);