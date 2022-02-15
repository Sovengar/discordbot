const { Message, Client, MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
    name: "xokasW",
    aliases: ['xokasW'],
    description: "XokasW",
    usage: "",
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const attachment = new MessageAttachment('./mediaFiles/images/xokas_xokasW.gif')
        //const embed = new MessageEmbed().setImage('attachment://khe.png');
        //message.channel.send({ embeds: [embed], files: [attachment] }); 
        message.channel.send({ files: [attachment] }); 
    },
};