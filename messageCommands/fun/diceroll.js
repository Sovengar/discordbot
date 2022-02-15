const { Message, Client } = require("discord.js");

module.exports = {
    name: "diceroll",
    aliases: ['randnum'],
    description: "Returns a random number between 0-100",
    cooldown: 5,
    usage: "",
    userPermissions: [,],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        message.channel.sendMessage('Random number: '+ Math.round(Math.random()*100));
    },
};