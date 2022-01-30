const fetch = require('node-fetch');
const Discord = require('discord.js');

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
};