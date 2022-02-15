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
    },
};