const { Client, Message, MessageEmbed, } = require("discord.js");

module.exports = {
    name: "member-join",
    aliases : ['member-join_position'],
    description: "Shows the position you got when joined",
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

        const membersAux = message.guild.members.cache
            .sort( (a,b) => a.joinedTimestamp - b.joinedTimestamp )

        const members = Array.from(membersAux.values())

        const position = new Promise(ful => {
            for (let i = 1; i < members.length + 1; i++) {
                if(members[i-1].id === member.id) ful(i)
            }
        })

        message.reply({ content: `${member} is the ${await position} member to join the server!` });
    } 
}