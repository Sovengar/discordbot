const { Member, MessageAttachment } = require("discord.js")
const canvacord = require("canvacord")
const client = require('../client/discordBot')
const GuildSettings = require('../models/GuildSettings');

module.exports = {name: "leave",};
/**
* @param {Member} member
*/
client.on("guildMemberRemove", async (member) => {
    const guildSettings = await GuildSettings.findOne({ guild_id: member.guild.id });
    if (!guildSettings) return;
    if (!guildSettings.leaveChannelId || !guildSettings.allowLeave) return;
    
    const leaveChannel = member.guild.channels.cache.get(guildSettings.leaveChannelId)
    if(!leaveChannel) return;

    const leaver = new canvacord.Leaver()
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setMemberCount(member.guild.memberCount)
        .setGuildName(member.guild.name)
        .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "png" }))
        .setBackground("https://cdn.discordapp.com/banners/536238813119381524/1ff11c559c04e5127dd897b02d67a86e.png?size=2048")
        .setColor("title", "#2f35e0")
        .setColor("title-border", "#ffffff")
        .setColor("avatar", "#2f35e0")
        .setColor("username", "#000000")
        .setColor("username-box", "#c6e2ff")
        .setColor("hashtag", "#faebd7")
        .setColor("discriminator", "#000000")
        .setColor("discriminator-box", "#2f35e0")
        .setColor("message", "#faebd7")
        .setColor("message-box", "#2f35e0")
        .setColor("member-count", "#fefede")
        .setColor("background", "#2f35e0")
        .setColor("border", "#faebd7")

    leaver.build().then(data => {
        const attachment = new MessageAttachment(data, 'leave.png')
        leaveChannel.send({ content: `${member.user} just left the server!`, files: [attachment] })
    })
});
