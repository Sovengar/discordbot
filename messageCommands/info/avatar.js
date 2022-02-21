const { Message, Client, MessageAttachment, MessageEmbed } = require("discord.js");
const { getMember } = require('../../functions/utils')

module.exports = {
    name: "avatar",
    aliases: ['avatar'],
    description: "Shows the avatar of the user provided else gets yours",
    usage: "[member]",
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
        const member = getMember(client, message, args[0]) || message.member

        message.channel.send({ embeds: [
            new MessageEmbed()
                .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: '' })
                .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            ] 
        })
    },
};