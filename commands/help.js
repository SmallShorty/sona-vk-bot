const commands_data = require("./commands.json");

module.exports = async (context) => {
    let response = '';
    Object.entries(commands_data).forEach(([command, data]) => {
        response += `📋 Команда: ${command}\n `;
        response += data.description + '\n';
        if (data.aliases && data.aliases.length > 0) {
            response += `🔄 Синонимы: ${data.aliases.join(", ")}\n`;
        }
        response += '\n';
    })

    await context.send(response);
}