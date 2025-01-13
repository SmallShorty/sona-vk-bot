const commands_data = require("./commands.json");

module.exports = async (context) => {
    let response = '';

    const filteredCommands = Object.entries(commands_data)
        .filter(([command, data]) => !data.wip)
        .sort(([commandA], [commandB]) => commandA.localeCompare(commandB)); 
    filteredCommands.forEach(([command, data]) => {
        response += `📋 Команда: ${command}\n `;
        response += data.description + '\n';
        if (data.aliases && data.aliases.length > 0) {
            response += `🔄 Синонимы: ${data.aliases.join(", ")}\n`;
        }
        response += '\n';
    });

    await context.send(response);
}
