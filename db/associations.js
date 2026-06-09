const Chat      = require('./models/chat');
const Fandom    = require('./models/fandom');
const Character = require('./models/character');

Chat.hasMany(Fandom,    { foreignKey: 'chat_id', onDelete: 'CASCADE' });
Chat.hasMany(Character, { foreignKey: 'chat_id', onDelete: 'CASCADE' });

Fandom.belongsTo(Chat,    { foreignKey: 'chat_id' });
Fandom.hasMany(Character, { foreignKey: 'fandom_id', onDelete: 'SET NULL' });

Character.belongsTo(Chat,   { foreignKey: 'chat_id' });
Character.belongsTo(Fandom, { foreignKey: 'fandom_id' });
