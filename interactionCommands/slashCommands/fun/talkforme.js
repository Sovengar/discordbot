const { Message, Client, CommandInteraction, } = require("discord.js");

module.exports = {
    name: "talkforme",
    description: "Makes the bot say something instead of you!",
    usage: "[text] \nExample: command text",
    cooldown: 5,
    type: "CHAT_INPUT",
    permissions: "",
    options: [
        { name: "text", description: "Tell the bot what to say", type: "STRING", required: true },
    ],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const msg = interaction.options.getString("text");
        interaction.followUp(`${msg}`)
    },
};