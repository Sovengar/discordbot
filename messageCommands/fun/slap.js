const { Message, Client, MessageAttachment } = require("discord.js");
const { Canvas } = require("canvacord");

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
        const user = message.mentions.users.first();

        if(!user)
            return message.reply("Please mention a user!");
        
        const avatar = user.displayAvatarURL({ format: "png" })
        const image = await Canvas.slap(message.author.displayAvatarURL({ format: "png" }), avatar);
        const attachment = new MessageAttachment(image, "image.gif")

        message.channel.send({ files: [attachment] }); 
    },
};
