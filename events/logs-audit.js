const { MessageEmbed } = require('discord.js')
const client = require('../client/discordBot')
const GuildSettings = require("../models/GuildSettings");

const color = 'RED'

module.exports = { name: "logs-audit", };




///LOGS ON DEV GUILD
let devGuildLogsChannel = client.config.logsChannel

client.on("guildCreate", (guild) => {
    const channel = client.channels.cache.get(devGuildLogsChannel)
    channel.send( { embeds: [
        new MessageEmbed()
            .setColor('GREEN')
            .setTitle('NEW SERVER!') 
            .addField('GUILD INFO', `${guild.name} (${guild.id}) **${guild.memberCount} members!**`)
            .addField('OWNER INFO', `<@!${guild.ownerId}> (${guild.ownerId})`)
            .setFooter({ text: `Currently in ${client.guilds.cache.size} guilds!` })
            .setThumbnail(guild.iconURL( { dynamic: true } ))
            .setTimestamp()
    ]})
}) 

client.on("guildDelete", (guild) => {
    const channel = client.channels.cache.get(devGuildLogsChannel)
    channel.send( { embeds: [
        new MessageEmbed()
            .setColor('GREEN')
            .setTitle('REMOVED FROM SERVER!') 
            .addField('GUILD INFO', `${guild.name} (${guild.id}) **${guild.memberCount} members!**`)
            .addField('OWNER INFO', `<@!${guild.ownerId}> (${guild.ownerId})`)
            .setFooter({ text: `Currently in ${client.guilds.cache.size} guilds!` })
            .setThumbnail(guild.iconURL( { dynamic: true } ))
            .setTimestamp()
    ]})
}) 





///LOGS ON CHANNEL GUILD
let logChannel;

// When a member gets a role
client.on("guildMemberRoleAdd", async (member, role) => {
    GuildSettings.findOne({ guild_id: member.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const raddEmbed = new MessageEmbed()
        .setTitle(`${logsEmoji} - MEMBER UPDATE`)
        .setColor(color)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`**${member.user.tag}** has got the role: \`${role.name}\``)
        .setTimestamp()

    try {
        return member.guild.channels.cache.get(logChannel).send({ embeds: [raddEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a member looses a role
client.on("guildMemberRoleRemove", async (member, role) => {
    GuildSettings.findOne({ guild_id: member.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const rrmvEmbed = new MessageEmbed()
        .setTitle(`${logsEmoji} - MEMBER UPDATE`)
        .setColor(color)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`**${member.user.tag}** has lost the role: \`${role.name}\``)
        .setTimestamp()

    try {
        return member.guild.channels.cache.get(logChannel).send({ embeds: [rrmvEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a member's nickname is updated
client.on("guildMemberNicknameUpdate", async (member, oldNickname, newNickname) => {
    GuildSettings.findOne({ guild_id: member.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const nickchEmbed = new MessageEmbed()
        .setTitle(`${logsEmoji} - NICKNAME UPDATE`)
        .setColor(color)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`**${member.user.tag}**'s nickname has been changed from: \`${oldNickname}\` to: \`${newNickname}\``)
        .setTimestamp()

    try {
        return member.guild.channels.cache.get(logChannel).send({ embeds: [nickchEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a channel topic is changed
client.on("guildChannelTopicUpdate", async (channel, oldTopic, newTopic) => {
    GuildSettings.findOne({ guild_id: channel.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const tchEmbed = new MessageEmbed()
        .setTitle(`${logsEmoji} - TOPIC UPDATED`)
        .setColor(color)
        .setDescription(`${channel}'s topic changed from **${oldTopic}** to **${newTopic}**`)
        .setTimestamp()

    try {
        return channel.guild.channels.cache.get(logChannel).send({ embeds: [tchEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a member boosts a server
client.on("guildMemberBoost", async (member) => {
    GuildSettings.findOne({ guild_id: member.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const bstEmbed = new MessageEmbed()
        .setTitle(`${logsEmoji} - SERVER BOOSTED`)
        .setColor(color)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`**${member.user.tag}** has started boosting: ${member.guild.name}`)
        .setTimestamp()

    try {
        return role.guild.channels.cache.get(logChannel).send({ embeds: [bstEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a member removes server boosting
client.on("guildMemberUnboost", async (member) => {
    GuildSettings.findOne({ guild_id: member.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const bstnEmbed = new MessageEmbed()
        .setTitle(`${logsEmoji} - SERVER BOOST STOPPED`)
        .setColor(color)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`**${member.user.tag}** has stopped boosting: ${member.guild.name}`)
        .setTimestamp()

    try {
        return role.guild.channels.cache.get(logChannel).send({ embeds: [bstnEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a role is created
client.on('roleCreate', async (role) => {
    GuildSettings.findOne({ guild_id: role.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const rcreateEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - ROLE CREATED`)
        .setDescription(`A role has been created named: ${role}, \`${role.name}\``)
        .setTimestamp()

    try {
        return role.guild.channels.cache.get(logChannel).send({ embeds: [rcreateEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a role is deleted
client.on('roleDelete', async (role) => {
    GuildSettings.findOne({ guild_id: role.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const rdeleteEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - ROLE DELETED`)
        .setDescription(`A role has been deleted named: ${role}, \`${role.name}\``)
        .setTimestamp()

    try {
        return role.guild.channels.cache.get(logChannel).send({ embeds: [rdeleteEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a message is deleted
client.on('messageDelete', async (message) => {
    GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!message.guild) return
    if (!logChannel) return

    const logsEmoji = "💡"

    const msgdelEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - MESSAGE DELETED`)
        .setDescription(`Message has been deleted in <#${message.channel.id}>. Use \`snipe\` command in the channel to see the deleted message!`)
        .setTimestamp()

    try {
        return message.guild.channels.cache.get(logChannel).send({ embeds: [msgdelEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a channel is created
client.on('channelCreate', async (channel) => {
    GuildSettings.findOne({ guild_id: channel.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const chncrtEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - CHANNEL CREATED`)
        .setDescription(`A channel has been created named: ${channel}, \`${channel.name}\``)
        .setTimestamp()

    try {
        return channel.guild.channels.cache.get(logChannel).send({ embeds: [chncrtEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a channel is deleted
client.on('channelDelete', async (channel) => {
    GuildSettings.findOne({ guild_id: channel.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const chndelEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - CHANNEL DELETED`)
        .setDescription(`A channel has been deleted named: **${channel.name}**`)
        .setTimestamp()

    try {
        return channel.guild.channels.cache.get(logChannel).send({ embeds: [chndelEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When an emoji is added
client.on('emojiCreate', async (emoji) => {
    GuildSettings.findOne({ guild_id: emoji.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const emjcrtEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - EMOJI CREATED`)
        .setDescription(`A emoji has been added to the server: ${emoji}, **${emoji.id}**`)
        .setTimestamp()

    try {
        return emoji.guild.channels.cache.get(logChannel).send({ embeds: [emjcrtEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When an emoji is removed
client.on('emojiDelete', async (emoji) => {
    GuildSettings.findOne({ guild_id: emoji.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const emjdelEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - EMOJI DELETED`)
        .setDescription(`A emoji has been removed from the server: ${emoji}, **${emoji.id}**`)
        .setTimestamp()

    try {
        return emoji.guild.channels.cache.get(logChannel).send({ embeds: [emjdelEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a user is banned
client.on('guildBanAdd', async (guild, user) => {
    GuildSettings.findOne({ guild_id: guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })

    if (!logChannel) return

    const logsEmoji = "💡"

    const banaddEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - USER BANNED`)
        .setDescription(`A member has been banned from the server`)
        .setTimestamp()

    try {
        return guild.guild.channels.cache.get(logChannel).send({ embeds: [banaddEmbed] })
    } catch (err) {
        console.log(err)
    }
})

// When a user is unbanned
client.on('guildBanRemove', async (guild, user) => {
    GuildSettings.findOne({ guild_id: guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        logChannel = data.logChannelId
    })
    if (!logChannel) return

    const logsEmoji = "💡"

    const banrmvEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${logsEmoji} - USER BAN REMOVED`)
        .setDescription(`A member's ban has been removed from the server`)
        .setTimestamp()

    try {
        return guild.guild.channels.cache.get(logChannel).send({ embeds: [banrmvEmbed] })
    } catch (err) {
        console.log(err)
    }
})
