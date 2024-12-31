const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const { token } = require("./config.js")

require("./handlers/eventHandler").execute(client);
require("./handlers/commandHandler").execute(client);

require("./api.js");

client.login(token);

module.exports = {client};