const reactionRolesModel = require("../../models/reactionRoles")
const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: "reaction-panel",
    aliases: ["reaction-panel"],
    description: "Shows the reaction role panel",
    usage: "",
    botPermissions: ["ADD_REACTIONS"],
    userPermissions: ["ADMINISTRATOR"],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const channel = message.channel || message.mentions.channels.first()

        reactionRolesModel.findOne({ Guild: message.guild.id }, async (err, data) => {
            if (!data) 
                return message.reply("No reaction role data can be found!")

            const mapped = Object.keys(data.Roles).map((value, index) => {
                const role = message.guild.roles.cache.get(data.Roles[value][0])
                return `\`${index + 1}.\` ${data.Roles[value][1].raw} -React to get: ${role}`
            }).join("\n\n")

            const rrEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle("REACTION ROLES")
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setDescription("React with the emojis below to assign yourself to a role!")
                .addField("\u200B", mapped)
                .setTimestamp()

            channel.send({ embeds: [rrEmbed] }).then((msg) => {
                data.Message = msg.id
                data.save()

                const reactions = Object.values(data.Roles).map((val) => val[1].id)

                reactions.map(
                    (emoji) => msg.react(emoji)
                        .catch(error => {
                            message.reply("You must use emojis from this server to make it work!")
                            console.error(error)
                        })
                )
            })
        })
    }
}