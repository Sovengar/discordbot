const { Client, Message, MessageEmbed, MessageActionRow, MessageButton  } = require('discord.js')
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    name: "suggestion",
    aliases: ["suggest", "report", "report-bug"],
    description: "Creates a suggestion",
    usage: '<Your Suggestion>',
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
        const query = args.join(" ")
        if (!query) return message.reply("State your suggestion please!")
        
        const guildSettings = GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
			if (err) {
				console.log(err);
				return message.reply("An error occurred while trying to set the auto role feature!");
			}

			if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
			} 
            
            data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the auto role feature!");
				}
			})
		})

        if(!guildSettings.allowSuggestion) return message.reply("Suggestions are currently disabled, ask an admin!")
        if (!guildSettings.suggestionChannelId) return message.reply("Suggestion Channel is not set yet, ask an admin!")

        const image = message.attachments.first() ? message.attachments.first().proxyURL : null

        const sugEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("NEW SUGGESTION")
            .setDescription(`${query}\n\n\`Suggested by ${message.author.tag}\``)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setImage(image)
            .setTimestamp()

        const channel = message.guild.channels.cache.get(guildSettings.suggestionChannelId)

        const row = new MessageActionRow().addComponents(

            new MessageButton()
                .setCustomId("sug-acc")
                .setStyle("SUCCESS")
                .setLabel("ACCEPT"),

            new MessageButton()
                .setCustomId("sug-dec")
                .setStyle("DANGER")
                .setLabel("DECLINE"),

        )

        message.reply("Your suggestion has been submitted")

        const sugPage = await channel.send({ embeds: [sugEmbed], components: [row] })

        const col = await sugPage.createMessageComponentCollector({
            componentType: "BUTTON"
        })

        col.on("collect", async i => {

            const interactor = i.guild.members.cache.get(i.user.id)

            if (!interactor.permissions.has("MANAGE_GUILD")) return

            if (i.customId === "sug-acc") {

                const accEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("SUGGESTION ACCEPTED")
                    .setDescription(`Your suggestion on **${query}** has been accepted`)
                    .addFields([
                        { name: "Accepted by:", value: `${i.user.tag}`, inline: true },
                        { name: "Accepted in:", value: `${i.guild.name}`, inline: true },
                    ])
                    .setTimestamp()
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))

                message.author.send({ embeds: [accEmbed] }).catch(err => {

                    if (err.code !== 50007) return console.log(err)

                })

                col.stop("accepted")

            } else if (i.customId === "sug-dec") {

                const decEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("SUGGESTION DECLINED")
                    .setDescription(`Your suggestion on **${query}** has been declined. Better luck next time`)
                    .addFields([
                        { name: "Declined by:", value: `${i.user.tag}`, inline: true },
                        { name: "Declined in:", value: `${i.guild.name}`, inline: true },
                    ])
                    .setTimestamp()
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))

                message.author.send({ embeds: [decEmbed] }).catch(err => {

                    if (err.code !== 50007) return console.log(err)

                })

                col.stop("declined")

            }

        })

        col.on("end", async (collected, reason) => {

            if (reason === "accepted") {

                const accEmbed1 = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("SUGGESTION ACCEPTED")
                    .setDescription(`${query}\n\n\`Suggested by ${message.author.tag}\``)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setImage(image)
                    .setTimestamp()

                sugPage.edit({ embeds: [accEmbed1], components: [] })

            } else if (reason === "declined") {

                const decEmbed1 = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("SUGGESTION DECLINED")
                    .setDescription(`${query}\n\n\`Suggested by ${message.author.tag}\``)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setImage(image)
                    .setTimestamp()

                sugPage.edit({ embeds: [decEmbed1], components: [] })

            } 

        })

    },
};