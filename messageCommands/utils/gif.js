const { Message, Client } = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: "gif",
    aliases: ['gif'],
    description: "Shows a gif based on the argument provided else gets a random gif",
    usage: "[keyword] \nExample 1: command \nExample 2: command dogs",
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let keywords = 'random';
        if (args.length > 0) keywords = args.join(' ');
        let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${client.config.tenor_key}&contentfilter=high`;
        let response = await fetch(url);
        let json = await response.json();
        const index = Math.floor(Math.random() * json.results.length);
        
        message.reply(json.results[index].url);
    },
};