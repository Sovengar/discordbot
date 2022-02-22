const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const client = require("../client/discordBot")

module.exports = { name: "ticket", };

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'delticket') {
            const channel = interaction.channel
            channel.delete()
        }
    }
})