const client = require("../client/discordBot")
const GuildSettings = require('../models/GuildSettings')
const { Permissions } = require("discord.js");

module.exports = { name: "anti-curse", };

client.on("messageCreate", async(message) => {
    if ( message.author.bot || !message.guild || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) ) return

    const guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id });

    if(!guildSettings?.allowAnticurse) return;

    if (guildSettings.bannedWords.some(word => message.content.toLowerCase().includes(word))) {
        message.delete().catch(err => { if (err.code !== 10008) return console.log(err) })
        message.channel.send(`${message.author}, the word you used is blacklisted in this server!`)
    }
})