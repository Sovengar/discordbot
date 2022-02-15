const { DiscordTogether } = require('discord-together');
const client = require('./discordBot.js');

const discordTogether = new DiscordTogether(client);

module.exports = discordTogether;