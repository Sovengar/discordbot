const { Message, Client, MessageEmbed} = require("discord.js");
const { getMember } = require('../../functions/utils')

module.exports = {
    name: "deafen",
    aliases : ['deafen'],
    description: "Member is banned from hearing on voice channels.",
    userPermissions: ["MANAGE_CHANNELS",],
    botPermissions: ["MANAGE_ROLES",],
    cooldown: 5,
    usage: "<on/off> <member> \nExample: command on/off @user",
    /**
     * @Param {Client} client
     * @Param {Message} message
     * @Param {String[]} args
     */
    run: async (client, message, args) => {
        let toggling = ["on", "off"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `on` or `off`!")
            ]})

        const member = getMember(client, message, args[1])
        if (!member) return message.reply("Please specify a member!")

        let isMemberOnVC = await member.voice.channel;
        if (!isMemberOnVC) return message.reply(`${member} is not on a voice channel!`)

        if(args[0]?.toLowerCase() === 'on') {
            member.voice.setDeaf(true)
            message.reply(`${member} has been deafened!`) 
        }

        else if(args[0]?.toLowerCase() === 'off') {
            member.voice.setDeaf(false)
            message.reply(`${member} has been undeafened!`) 
        }
    },
};