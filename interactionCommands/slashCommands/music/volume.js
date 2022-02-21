const player = require("../../../client/discordMusicPlayer");
const { Client, CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: "volume",
    description: "change or check the volume of the current song",
    permissions: "",
    cooldown: 5,
    options: [
        {
            name: "percentage",
            description: "percentage to change the volume to",
            type: "INTEGER",
            required: false,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        await interaction.deferReply()
        const volumePercentage = interaction.options.getInteger("percentage");
        const queue = player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - You have to be in a Voice Channel to use this command!`)
            ] })

        if (!queue?.playing) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor("#3d35cc")
                    .setDescription(`‼️ - No music is currently be played in this server!`)
            ] })

        if (interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - Music is currently being played in **${interaction.guild.me.voice.channel.name}**. You've to be in the same Voice Channel to execute this command!`)
            ] })

        if (!volumePercentage) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor("#3d35cc")
                    .setDescription(`🔊 - The current volume is \`${queue.volume}%\``)
            ] })
 
        if (volumePercentage < 0 || volumePercentage > 100) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor("#3d35cc")
                    .setDescription(`‼️ - The volume must be betweeen \`1\` and \`100\`!`)
            ] })

        queue.setVolume(volumePercentage);

        return interaction.followUp({ embeds: [
            new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`✅ - Volume has been set to \`${volumePercentage}%\``)
        ] })
    },
};