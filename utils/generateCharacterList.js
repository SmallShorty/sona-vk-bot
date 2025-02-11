const Character = require('../db/models/character'); 
const Fandom = require('../db/models/fandom'); 
const { mentionUser } = require('./getUserInfo'); 

async function generateCharacterList(characters) {
    console.time('generateCharacterList'); 
    
    const fandomIds = [...new Set(characters.map(c => c.dataValues.fandom_id).filter(Boolean))];

    const fandoms = await Fandom.findAll({
        where: { id: fandomIds },
        attributes: ['id', 'name'],
        raw: true
    });
    const fandomMap = Object.fromEntries(fandoms.map(f => [f.id, f.name]));
    
    const charactersByFandom = {};
    for (const character of characters) {
        const fandomId = character.dataValues.fandom_id || 'no_fandom';
        if (!charactersByFandom[fandomId]) {
            charactersByFandom[fandomId] = [];
        }
        charactersByFandom[fandomId].push(character);
    }

    const sortedFandoms = Object.keys(charactersByFandom).sort((a, b) => {
        if (a === 'no_fandom') return 1;
        if (b === 'no_fandom') return -1;
        return a.localeCompare(b);
    });

    sortedFandoms.forEach(fandomId => {
        charactersByFandom[fandomId].sort((a, b) =>
            a.dataValues.nickname.localeCompare(b.dataValues.nickname)
        );
    });
    
    const userIds = [...new Set(characters.map(c => c.dataValues.user_id))];
    const userMentions = Object.fromEntries(
        await Promise.all(userIds.map(async id => [id, await mentionUser(id)]))
    );
    
    let output = '';
    for (const fandomId of sortedFandoms) {
        const fandomName = fandomId === 'no_fandom' ? '' : (fandomMap[fandomId] || 'Неизвестный фандом');
        output += `\n${fandomName}\n`;

        for (const character of charactersByFandom[fandomId]) {
            const icon = character.dataValues.icon ? ` [${character.dataValues.icon}]` : '';
            const owner = userMentions[character.dataValues.user_id] || 'Неизвестный пользователь';
            output += `  ${character.dataValues.nickname}${icon} – ${owner}\n`;
        }
    }

    return output.trim();
}

module.exports = generateCharacterList;
