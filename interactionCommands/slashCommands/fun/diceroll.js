const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "diceroll",
    description: "Returns a random number between 0-100",
    type: 'CHAT_INPUT',
    usage: "",
    permissions: "",
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        interaction.followUp('Random number: '+ Math.round(Math.random()*100));
    },
};