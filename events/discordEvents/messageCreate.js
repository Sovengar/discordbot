const { Client, Message, } = require("discord.js");
require('dotenv')
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
    name: "messageCreate",
    /**
    * @param {Message} message
    * @param {Client} client
    */
    run: async (message, client) => {
        if (message.author.bot || !message.guild ) return; 

        //GETTING GUILD SETTINGS
        const guildSettings = await GuildSettings.findOne({ guild_id: message.member.guild.id })

        ///GETTING THE PREFIX FROM THE DB AND SETTING IT TO THE CLIENT
        let prefix = guildSettings?.prefix ? guildSettings.prefix : process.env.PREFIX

        //IF A USER STARTS A MESSAGE MENTIONING THE BOT, HE WILL REPLY
        if( message.mentions.has(client.user) && message.content.toLowerCase().startsWith('<@') && !message.author.bot)
            return message.reply(`You pinged me. Listen buddy, my prefix is ${prefix} or / if you prefer.`)

    },
};