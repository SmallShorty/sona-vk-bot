const commands_data = require("../index.json");
const responses = require('../../data/responses.json');

function getCommandByAlias(alias) {
    for (const category in commands_data) {
        const commands = commands_data[category].commands;
        for (const command of commands) {
            if (command.aliases.includes(alias)) {
                return { ...command, category };
            }
        }
    }
    return null;
}

function formatCommandResponse(command) {
    let response = '';
    response += `📋 Команда: ${command.name}\n`;
    response += command.description + '\n';
    if (command.aliases && command.aliases.length > 0) {
        response += `🔄 Синонимы: ${command.aliases.join(", ")}\n`;
    }
    response += '\n';
    return response;
}

module.exports = async (context) => {
    const categorizedCommands = Object.entries(commands_data)
        .map(([category, data]) => {
            const commandList = data.commands.filter(command => !command.wip);
            if (commandList.length > 0) {
                return { category, name: data.name, commandList };
            }
            return null;
        })
        .filter(group => group !== null)
        .sort((a, b) => a.category.localeCompare(b.category));

    if (context.text.split(' ').length < 2) {
        let categoriesList = '📂 Доступные категории команд:\n';
        categorizedCommands.forEach(group => {
            categoriesList += `- ${group.name}\n`;
        });
        await context.send(categoriesList);
        return;
    }

    const args = context.text.split(' ');
    const categoryName = args[1];

    const category = categorizedCommands.find(group => 
        group.name.toLowerCase() === categoryName.toLowerCase() || 
        group.category.toLowerCase() === categoryName.toLowerCase()
    );

    if (category) {
        let response = `📂 Категория: ${category.name}\n\n`;
        category.commandList.forEach(command => {
            response += formatCommandResponse(command);
        });
        await context.send(response);
    } else {
        const alias = args[1];
        const command = getCommandByAlias(alias);

        if (command) {
            await context.send(formatCommandResponse(command));
        } else {
            await context.send(responses.errors.not_found);
        }
    }
};