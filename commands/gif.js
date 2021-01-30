// Command Handler
// Discord Bots
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/bots/discord/06-command-handler.html
// https://youtu.be/B60Q74FHFBQ

const fetch = require('node-fetch');
const Discord = require('discord.js');

// inside a command, event listener, etc.
const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');


module.exports = async function(msg, args) {
  msg.delete().catch(O_o=>{});
  let keywords = 'random';
  if (args.length > 0) {
    keywords = args.join(' ');
  }
  let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENOR_KEY}&contentfilter=high`;
  let response = await fetch(url);
  let json = await response.json();
  const index = Math.floor(Math.random() * json.results.length);
  msg.channel.send(json.results[index].url);
  msg.channel.send(`by ${msg.author.username}`);
  msg.channel.send(exampleEmbed);
};