const { Message, Client, MessageAttachment } = require("discord.js");
const { Canvas } = require("canvacord");
const { getMember } = require('../../functions/utils')

module.exports = {
    name: "slap",
    aliases: ["slap"],
    description: "Slaps a member",
    usage: '<member> \nExample: command @random',
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
        const member = getMember(client, message, args[0])
        if(!member) return message.reply("Please mention a member!");
        
        const avatar = member.user.displayAvatarURL({ format: "png" })
        const image = await Canvas.slap(message.author.displayAvatarURL({ format: "png" }), avatar);
        const attachment = new MessageAttachment(image, "image.gif")

        message.channel.send({ files: [attachment] }); 
    },
};
