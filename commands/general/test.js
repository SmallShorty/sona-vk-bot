const { Keyboard, Params } = require('vk-io');
const vk = require("../../vkClient");
const { sceneManager } = require('../../managers');
const { StepScene } = require('@vk-io/scenes');

module.exports = async (context) => {
    try {
        console.log('Начало обработки. Контекст:', {
            peerId: context.peerId,
            senderId: context.senderId,
            isChat: context.isChat,
            messageType: context.type
        });

        // // Проверка прав бота в беседе
        // if (context.isChat && !context.isAdmin) {
        //     await context.send("Боту нужны права администратора в этой беседе!");
        //     return;
        // }

        // Определяем целевого пользователя
        const targetUserId = context.isChat 
            ? context.senderId  // В беседах берем ID отправителя
            : context.peerId;   // В ЛС берем peerId

        // Первый вопрос
        console.log('Отправка первого вопроса с параметрами:', { targetUserId });
        const answer = await context.question(
            'Согласны-ли Вы на обработку персональных данных?',
            { targetUserId }
        );
        console.log('Получен ответ:', {
            text: answer.text,
            userId: answer.senderId,
            peerId: answer.peerId
        });

        // Проверка ответа
        if (!/да|yes|согласен|конечно/i.test(answer.text)) {
            console.log('Пользователь отказался от соглашения');
            await context.send('Тогда, мы не можем совершить регистрацию');
            return;
        }

        await context.send('Отлично, тогда продолжим');
        console.log('Пользователь согласился. PeerId:', context.peerId);

        // Функция для отправки вопросов
        const askQuestion = async (questionText) => {
            const params = {
                targetUserId: context.isChat ? context.senderId : context.peerId
            };
            console.log('Отправка вопроса:', { questionText, params });
            const response = await context.question(questionText, params);
            console.log('Получен ответ на вопрос:', {
                question: questionText,
                text: response.text,
                userId: response.senderId
            });
            return response;
        };

        // Задаем вопросы
        const age = await askQuestion('Введите Ваш возраст');
        const email = await askQuestion('Введите Ваш имейл');
        const phone = await askQuestion('Введите Ваш номер телефона');

        // Логируем полученные данные
        console.log('Все данные получены:', {
            age: age.text,
            email: email.text,
            phone: phone.text
        });

        // Отправляем итоговое сообщение
        await context.send(
            `Возраст: ${age.text}\nЭл. адрес: ${email.text}\nТелефон: ${phone.text}`
        );

    } catch (error) {
        console.error('Произошла ошибка:', {
            error: error.message,
            stack: error.stack,
            context: {
                peerId: context.peerId,
                senderId: context.senderId,
                isChat: context.isChat
            }
        });
        await context.send('Произошла техническая ошибка, попробуйте позже');
    }
};