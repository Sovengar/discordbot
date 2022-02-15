const canvacord = require("canvacord")
const GuildSettings = require("../models/GuildSettings");
const Levels = require("discord-xp")
const client = require('../client/discordBot')
Levels.setURL(client.config.mongoDB_url)

module.exports = { name: "levels",};

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) 
        return

    const guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id });
    
    if(!guildSettings || !guildSettings.allowLeveling)
        return;

        /*
    const levelingChannel = message.guild.channels.cache.get(guildSettings.levelingChannelId)

    if(levelingChannel !== message.channel)
        return;
    */

    //CHECKING IF THE MESSAGE IS FROM A DISABLED CHANNEL
    const channel = guildSettings.disabledLevelingChannels.findIndex( (prop) => prop === message.channel.id )
    if (channel != -1) 
        return;

    //CODE FOR A MESSAGE IN A VALID CHANNEL
    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp)

    if (hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id)
        message.channel.send({ content: `Congrats ${message.author}, you've now reached **Level ${user.level}**!` })
    }
})