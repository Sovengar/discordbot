const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const client = require("../client/discordBot")

module.exports = { name: "ticket", };

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        await interaction.deferUpdate()
        if (interaction.customId === "tic") {
            const ticChannel = await interaction.guild.channels.create(`ticket-${interaction.user.id}`, {
                type: "GUILD_TEXT",
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"],
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"]
                    },
                    {
                        id: client.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"]
                    }
                ]
            })

            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle("Ticket")
                .setDescription("Hello there,\nThe staff will be here as soon as possible, mean-while tell us about your issue!\nThank You!")
                .setTimestamp()
                .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }), url: '' })

            const tktsucEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`Your ticket has successfully been created at ${ticChannel}`)

            //BUTTON TO DELETE THE TICKET
            const del = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("del")
                    .setLabel("🚮 Delete Ticket")
                    .setStyle("DANGER")
            )

            //TRY TO SEND THE MESSAGE
            try {
                await ticChannel.send({ content: `Welcome ${interaction.user}`, embeds: [embed], components: [del] })
                    .then(interaction.followUp({ 
                        embeds: [tktsucEmbed], 
                        ephemeral: true 
                    })).catch(err => console.log(err))
            } catch (err) {
                console.log(err)
            }

        } else if (interaction.customId === 'del') {
            const channel = interaction.channel
            channel.delete()
        }
    }
})