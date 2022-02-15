const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const ms = require('ms')
const GuildSettings = require("../../../models/GuildSettings");

module.exports = {
    name: "unmute",
    description: "Unmute a member",
    //UserPerms: ['MANAGE_MESSAGES'],
    //BotPerms: ['MANAGE_ROLES'],
    permissions: "MANAGE_ROLES",
    cooldown: 5,
    type: "CHAT_INPUT",
    options: [
        { name: "user", description: "Select a user to unmute", type: 6, required: true,},
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        try {
            const member = interaction.options.getMember("user")
            const role = interaction.guild.roles.cache.find(r => r.name === 'Muted')
            const row = new MessageActionRow().addComponents(

                new MessageButton()
                    .setStyle('DANGER')
                    .setCustomId('unmuteyes')
                    .setLabel('Yes'),

                new MessageButton()
                    .setStyle('PRIMARY')
                    .setCustomId('unmuteno')
                    .setLabel('No')
            )

            let unmuteAskEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription('**⚠️ - Do you really want to unmute this member?**')

            let unmuteEndEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription("‼️ - You didn't provide a response in time!")

            const unmuteEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`✅ - **${member.user.tag}** is now unmuted`)

            const unmuteEmbed2 = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`✅ - Cancelled unmute request`)

            const guildSettings = GuildSettings.findOne({ guild_id: interaction.guild.id })
            const logsChannel = guildSettings.logChannelId
            const logsEmoji = interaction.client.emojis.cache.get("879086263532130394")

            const umtlogEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setTitle(`${logsEmoji} - MEMBER UNMUTED`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Name:', value: `${member.user.tag}`, inline: true },
                    { name: 'Unmuted by:', value: `${interaction.user.tag}`, inline: true },
                )
                .setTimestamp()

            const unmutePage = await interaction.followUp({ embeds: [unmuteAskEmbed], components: [row] })

            const col = await unmutePage.createMessageComponentCollector({
                componentType: 'BUTTON',
                time: ms('10s'),
            })

            col.on('collect', async (i) => {

                if (i.user.id !== interaction.user.id) 
                    return

                if (i.customId == 'unmuteyes') {

                    const noroleerrEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription(`‼️ - Error unmuting the member, please make sure whether there is a role called, 'muted'!`)

                    const marEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription(`‼️ - **${member.user.tag}** is not muted!`)

                    if (!role) return unmutePage.edit({ embeds: [noroleerrEmbed], components: [] })

                    if (!member.roles.cache.has(role.id)) return unmutePage.edit({ embeds: [marEmbed], components: [] })

                    const nomutemnEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription('‼️ - Member was not muted!')

                    GuildSettings.findOne({ guild_id: interaction.guild.id }, async (err, data) => {
                        if (!data) 
                            return unmutePage.edit({ embeds: [nomutemnEmbed], components: [] })

                        const user = data.mutedUsers.findIndex((prop) => prop === member.id)

                        if (user < 0) 
                            return unmutePage.edit({ embeds: [nomutemnEmbed], components: [] })

                        data.mutedUsers.splice(user, 1)
                        data.save()

                        await member.roles.remove(role)

                        unmutePage.edit({ embeds: [unmuteEmbed], components: [] })

                        console.log(`${interaction.user.tag} (${interaction.user.id}) has unmuted ${member.user.tag} (${member.user.id}) in ${interaction.guild.name} (${interaction.guild.id})`)

                        if (logsChannel) {
                            interaction.guild.channels.cache.get(logsChannel).send({ embeds: [umtlogEmbed] })
                        }

                    })

                } else if (i.customId == 'unmuteno') {
                    unmutePage.edit({ embeds: [unmuteEmbed2], components: [] })
                }
            })

            col.on('end', (collected) => {
                if (collected.size === 0) {
                    return unmutePage.edit({ embeds: [unmuteEndEmbed], components: [] })
                }
            })

        } catch (err) {
            const errEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription("‼️ - An error occured while executing the command, please try again later!")

            interaction.followUp({ embeds: [errEmbed] })

            return console.log(err)
        }
    },
};