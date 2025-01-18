const commands_data = require("./commands.json");

function getCommandByAlias(alias) {
    for (const key in commands_data) {
        if (commands_data[key].aliases.includes(alias)) {
            return { name: key, ...commands_data[key] }; 
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
    let response = '';

    const CommandsList = Object.entries(commands_data)
        .filter(([command, data]) => !data.wip)
        .sort(([commandA], [commandB]) => commandA.localeCompare(commandB));
    
    if (context.text.split(' ').length < 2) {
        CommandsList.forEach(([command, data]) => {
            response += formatCommandResponse({ name: command, ...data });
        });
    } else {
        
        const alias = context.text.split(' ')[1];
        const command = getCommandByAlias(alias);

        if (command) {
            response += formatCommandResponse(command);
        } else {
            response += 'Такой команды нет!';
        }
    }
    await context.send(response);
};