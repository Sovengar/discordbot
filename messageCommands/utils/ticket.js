const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, } = require("discord.js");

module.exports = {
    name: "ticket",
    description: "Creates a support ticket",
    aliases: ["ticket"],
    usage: "",
    botPermissions: ["MANAGE_CHANNELS", "MANAGE_THREADS", "CREATE_PRIVATE_THREADS", "CREATE_PUBLIC_THREADS", ],
    userPermissions: [,],
    cooldown: 5,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
    */
    run: async (client, message, args) => {
        const tktEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }), url: '' })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setDescription("__**How to make a ticket**__\n" + "> Click on the button below saying 'Create Ticket'\n" + "> Once the ticket is made, you'll be able to type in there!")
            .setTitle("Tickets")
            .setTimestamp()

        const bt = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("tic")
                .setLabel("🎫 Create Ticket!")
                .setStyle("PRIMARY")
        )

        message.channel.send({ embeds: [tktEmbed], components: [bt] })

        const filter = i => i.customId === 'tic' && i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 10000 });

        collector.on('collect', async interaction => {
            if (interaction.isButton()) {
                await interaction.deferUpdate()
                if (interaction.customId === "tic") {
                    const ticChannel = await interaction.guild.channels.create(`ticket-${interaction.user.id}`, {
                        type: "GUILD_TEXT",
                        //parent : '756890395392081985',
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
        
                    //TRY TO SEND THE MESSAGE
                    try {
                        await ticChannel.send({ 
                            content: `Welcome ${interaction.user}`, 
                            embeds: [
                                new MessageEmbed()
                                    .setColor("RED")
                                    .setTitle("Ticket")
                                    .setDescription("Hello there,\nThe staff will be here as soon as possible, mean-while tell us about your issue!\nThank You!")
                                    .setTimestamp()
                                    .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }), url: '' })
                            ], 
                            components: [
                                new MessageActionRow().addComponents(
                                    new MessageButton()
                                        .setCustomId("delticket")
                                        .setLabel("🚮 Delete Ticket")
                                        .setStyle("DANGER")
                                )] 
                        })
                        .then(interaction.followUp({ 
                            embeds: [
                                new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`Your ticket has successfully been created at ${ticChannel}`)
                            ], 
                            ephemeral: true 
                        }))
                        .catch(err => console.log(err))
                    } catch (err) {
                        console.log(err)
                    }
                }
            } 
        });
    },
};