const { Message, Client, MessageAttachment } = require("discord.js");

module.exports = {
    name: "te meto una ostia",
    aliases: ['te meto una ostia'],
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
        //message.channel.send(`https://cdn.discordapp.com/attachments/215579574073950208/935269188140929094/unknown.png`);
        const attachment = new MessageAttachment('./mediaFiles/images/xokas_te_meto_una_ostia.png')
        //const embed = new MessageEmbed().setImage('attachment://khe.png');
        //message.channel.send({ embeds: [embed], files: [attachment] }); 
        message.channel.send({ files: [attachment] }); 
    },
};