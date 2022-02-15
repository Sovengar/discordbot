const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const moment = require("moment")

const filterLevels = {
    DISABLED: "Off",
    MEMBER_WITHOUT_ROLES: "No Role",
    ALL_MEMBERS: "Everyone"
}

const verificationLevels = {
    NONE: "None",
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    VERY_HIGH: "Very High"
}

module.exports = {
    name: "serverinfo",
    description: "Sends the server's information",
    cooldown: 5,
    usage: "",
    type: 'CHAT_INPUT',
    permissions: "",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        //Get all roles for the member except @everyone
        const roles = interaction.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1)

        //Check how many roles the user has, Discord doesnt allow showing more than 20.
        let rolesdisplay;
        if (roles.length < 20) {
            rolesdisplay = roles.join(' ')
            if (roles.length < 1) 
                rolesdisplay = "None"
        } else {
            rolesdisplay = `${roles.slice(20).join(" ")} \`and more...\``
        }

        const members = interaction.guild.members.cache
        const channels = interaction.guild.channels.cache
        const emojis = interaction.guild.emojis.cache

        const serverEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`Server Information for ${interaction.guild.name}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addField('General',
                `**❯ Name:** ${interaction.guild.name}
      **❯ ID:** ${interaction.guild.id}
      **❯ Owner:** <@!${interaction.guild.ownerId}> (${interaction.guild.ownerId})
      **❯ Boost Tier:** ${interaction.guild.premiumTier ? `Tier ${interaction.guild.premiumTier}` : 'None'}
      **❯ Explicit Filter:** ${filterLevels[interaction.guild.explicitContentFilter]}
      **❯ Verification Level:** ${verificationLevels[interaction.guild.verificationLevel]}
      **❯ Time Created:** ${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} ${moment(interaction.guild.createdTimestamp).fromNow()}\n\n`
            )
            .addField('Statistics',
                `**❯ Role Count:** ${roles.length}
      **❯ Emoji Count:** ${emojis.size}
      **❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}
      **❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}
      **❯ Member Count:** ${interaction.guild.memberCount}
      **❯ Humans:** ${members.filter(member => !member.user.bot).size}
      **❯ Bots:** ${members.filter(member => member.user.bot).size}
      **❯ Text Channels:** ${channels.filter(channel => channel.type === 'GUILD_TEXT').size}
      **❯ Voice Channels:** ${channels.filter(channel => channel.type === 'GUILD_VOICE').size}
      **❯ Boost Count:** ${interaction.guild.premiumSubscriptionCount || '0'}\n\n`
            )
            .addField(`Roles [${roles.length - 1}]`, rolesdisplay)
            .setTimestamp()

        interaction.followUp({ embeds: [serverEmbed] })
    },
};