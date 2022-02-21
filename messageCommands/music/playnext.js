const { Client, Message, MessageEmbed } = require('discord.js')
const { QueryType } = require("discord-player")
const player = require("../../client/discordMusicPlayer")

module.exports = {
    name: 'playnext',
    aliases: ['pnext'],
    description: "Adds the song to the top of the queue",
    usage: '<song name/url>',
    cooldown: 1,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const songTitle = args.join(" ")
        const queue = player.getQueue(message.guildId)

        if (!message.member.voice.channel) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - You have to be in a Voice Channel to use this command!`)
                ] })

        if (!queue?.playing) 
            return message.reply({ embeds: [
                new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`‼️ - No music is currently be played in this server!`)
            ] })

        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) 
            return message.reply({ embeds: [
                new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`‼️ - Music is currently being played in **${message.guild.me.voice.channel.name}**. You've to be in the same Voice Channel to execute this command!`)
            ] })

        if (!songTitle) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - Please provide a song URL or song name!`)
            ] })

        const searchResult = await player.search(songTitle, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO,
        })

        if (!searchResult || !searchResult.tracks.length) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - No results were found!`)
            ] })
             
        searchResult.playlist
            ? queue.insert(searchResult.tracks)
            : queue.insert(searchResult.tracks[0])

        message.reply({ embeds: [
            new MessageEmbed()
            .setColor("#3d35cc")
            .setDescription(`🎵 - Song added to the top **${searchResult.tracks[0]}** - requested by **${message.author.tag}** - into **${message.member.voice.channel.name}**`)
        ] })
    }
}