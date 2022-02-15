const client = require("../client/discordBot")
const GuildSettings = require("../models/GuildSettings");
const { Permissions } = require("discord.js");

module.exports = { name: "anti-links", };

client.on("messageCreate", async (message) => {

    if ( message.author.bot || !message.guild || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) ) 
        return

    const guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id });

    if (!guildSettings.allowAntilink) 
        return 

    //CHECKING IF THE CHANNEL IS AN ANTILINK CHANNEL
    const antiLinkChannelIndex = guildSettings.antiLinkChannels.findIndex((prop) => prop === message.channel.id)

    if(antiLinkChannelIndex < 0)
        return

    //CHECKING IF THE MESSAGE IS A LINK TO DELETE
    if (message.content.toLowerCase().includes("https://") || 
        message.content.toLowerCase().includes("http://") || 
        message.content.toLowerCase().includes("www.") || 
        message.content.toLowerCase().includes(".com") || 
        message.content.toLowerCase().includes(".gg") || 
        message.content.toLowerCase().includes(".xyz") || 
        message.content.toLowerCase().includes(".in") || 
        message.content.toLowerCase().includes("discord.gg/") || 
        message.content.toLowerCase().includes("discord.com/invite/") || 
        message.content.toLowerCase().includes(".ly") || 
        message.content.toLowerCase().includes("dsc.gg/")) {

        await message.delete().catch(err => {
            if (!err.code !== 10008) return console.log(err)
        })
        message.channel.send(`${message.author}, this channel is link protected. You can't send any links!`)
    } else return
})