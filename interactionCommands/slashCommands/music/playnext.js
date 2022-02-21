const { Client, CommandInteraction, MessageEmbed } = require('discord.js')
const { QueryType } = require("discord-player")
const player = require("../../../client/discordMusicPlayer")

module.exports = {
    name: 'playnext',
    aliases: ['pnext'],
    description: "Adds the song to the top of the queue",
    type: 'CHAT_INPUT',
    cooldown: 1,
    options: [
        {
            name: "songtitle",
            description: "title of the song",
            type: "STRING",
            required: true,
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
        const songTitle = interaction.options.getString("songtitle");
        const queue = player.getQueue(interaction.guildId)

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

        if (!songTitle) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - Please provide a song URL or song name!`)
            ] })

        const searchResult = await player.search(songTitle, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        })

        if (!searchResult || !searchResult.tracks.length) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - No results were found!`)
            ] })
             
        searchResult.playlist
            ? queue.insert(searchResult.tracks)
            : queue.insert(searchResult.tracks[0])

        interaction.followUp({ embeds: [
            new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`🎵 - Song added to the top **${searchResult.tracks[0]}** - requested by **${interaction.user.tag}** - into **${interaction.member.voice.channel.name}**`)
        ] })
    }
}