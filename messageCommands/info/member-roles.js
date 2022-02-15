const { Client, Message, MessageEmbed, } = require("discord.js");

module.exports = {
    name: "member-roles",
    aliases : ['member-roles'],
    description: "Shows all roles of a member",
    usage: "<member> \nExample 1: command @member \nExample 2: command member_id",
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => { 
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.reply("Please specify a member!")

        const memberRoles = member.roles.cache
            .filter( roles => roles.id !== message.guild.id ) //GETTING ALL ROLES EXCEPT EVERYONE
            .map( role => role.toString())

        message.reply({ embeds: [
            new MessageEmbed()
                .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: '' })
                .setDescription(`${member} \`roles =>\` ${memberRoles}`)
                .setColor("RANDOM")
        ]});
    } 
}