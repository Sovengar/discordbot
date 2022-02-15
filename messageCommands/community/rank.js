const { Message, Client, MessageAttachment, } = require("discord.js");
const Levels = require("discord-xp")
const canvacord = require("canvacord")
const GuildSettings = require("../../models/GuildSettings");
const client = require('../../client/discordBot')
Levels.setURL(client.config.mongoDB_url)

module.exports = {
    name: 'rank',
    aliases : ['rank'],
    description: "Sends member's rank card",
    usage: "",
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
        const guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id });
        
        if(!guildSettings)
            return;

        const target = message.author
        const user = await Levels.fetch(target.id, message.guild.id, true)

        if (!user) 
            return message.reply("Seems like the user has not gained enough XP!")

        const neededXp = Levels.xpFor(parseInt(user.level) + 1)

        const rank = new canvacord.Rank()
            .setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp)
            .setLevel(user.level)
            .setBackground("IMAGE", 'https://images-ext-1.discordapp.net/external/e4T8hd210iU3plXOhP1mATREfuJ0zqbhaRMxwhYcKno/https/i3.ytimg.com/vi/CuklIb9d3fI/maxresdefault.jpg?width=832&height=468')
            .setRequiredXP(neededXp)
            .setStatus(message.member.presence.status)
            .setProgressBar("BLUE", "COLOR")
            .setUsername(target.username)
            .setOverlay("RED", 0.7, true)
            .setDiscriminator(target.discriminator)

        rank.build().then(data => {
            const attachment = new MessageAttachment(data, 'rankcard.png')
            message.reply({ files: [attachment] })
        })  
    },
};