const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Sends the bot's current ping",
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
        await interaction.deferReply({ ephemeral: true}).catch(() => {});
        const interactionPage = await interaction.followUp({ content:'Loading data', });
        const ping = interactionPage.createdTimestamp - interaction.createdTimestamp;
        const pingEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("⌚ Pong!")
            .addFields([
                { name: "Bot Latency 🤖:", value: `${ping}` },
                { name: "API Latency 🦾:", value: `${Math.round(client.ws.ping)}` }
            ])
            .setTimestamp()
        
        interaction.editReply({ content: "✅ - Well, this is the current ping! 🏓", embeds: [pingEmbed],  });
    },
};

/*
const interactionPage = await interaction.followUp({ content:'Loading data', });
const ping = interactionPage.createdTimestamp - interaction.createdTimestamp;
const pingEmbed = new MessageEmbed()
    .setColor("RED")
    .setTitle("⌚ Pong!")
    .addFields([
        { name: "Bot Latency 🤖:", value: `${ping}` },
        { name: "API Latency 🦾:", value: `${Math.round(client.ws.ping)}` }
    ])
    .setTimestamp()

interactionPage.edit({ content: "✅ - Well, this is the current ping! 🏓", embeds: [pingEmbed],  });
*/