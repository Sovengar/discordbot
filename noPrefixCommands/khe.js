const { Message, Client, MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
    name: "khe",
    aliases: ['khe'],
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
        //message.channel.send(`https://cdn.discordapp.com/attachments/215579574073950208/935265460784627772/unknown.png`);
        const attachment = new MessageAttachment('./mediaFiles/images/xokas_khe.png')
        //const embed = new MessageEmbed().setImage('attachment://khe.png');
        //message.channel.send({ embeds: [embed], files: [attachment] }); 
        message.channel.send({ files: [attachment] }); 
    },
};