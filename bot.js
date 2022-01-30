console.log('Beep beep! 🤖');

require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

client.on('ready', readyDiscord);

function readyDiscord() {
  console.log('💖');
}

const commandHandler = require('./commands');

client.on('message', commandHandler);
