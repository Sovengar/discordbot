const { Member, MessageAttachment } = require("discord.js")
const client = require('../client/discordBot')
const canvacord = require("canvacord")
const GuildSettings = require('../models/GuildSettings');
const format = require('string-format')
format.extend(String.prototype, {})

module.exports = { name: "welcome", };
/**
* @param {Member} member
*/
client.on("guildMemberAdd", async (member) => {
    const guildSettings = await GuildSettings.findOne({ guild_id: member.guild.id });
    if (!guildSettings) return;
    const welcomeChannel = member.guild.channels.cache.get(guildSettings.welcomeChannelId);
    if (!guildSettings.allowWelcome || !guildSettings.welcomeChannelId) return;

    const welcomeImage = guildSettings.welcomeImage 
        ? guildSettings.welcomeImage 
        : "https://cdn.discordapp.com/attachments/850306937051414561/877186344965783614/WallpaperDog-16344.jpg"

    const welcomeMessage = guildSettings.welcomeMessage
        ? format(guildSettings.welcomeMessage, member)
        : `Hey ${member.user}, welcome to **${member.guild.name}**. Thanks for joining our server! 😄`

    const welcomer = new canvacord.Welcomer()
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setMemberCount(member.guild.memberCount)
        .setGuildName(member.guild.name)
        .setAvatar(member.user.displayAvatarURL({ dynamic: false, format : "png" }))
        .setBackground(welcomeImage)
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

    welcomer.build().then(data => {
        const attachment = new MessageAttachment(data, 'welcomer.png')
        welcomeChannel.send({ content: `${welcomeMessage}`, files: [attachment] })
    })
    member.send(`Hey, welcome to **${member.guild.name}**! Thanks for joining!`).catch(err => console.log(err))

    //ADDING MEMBER ROLE IF AUTOROLE IS ON
    const memberRole = member.guild.roles.cache.get(guildSettings.memberRoleId)
    if(guildSettings.allowAutoRole) 
        member.roles.add(memberRole).catch(err => console.log(err))
});