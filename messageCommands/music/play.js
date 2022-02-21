const { Client, Message, MessageEmbed } = require('discord.js')
const { QueryType } = require("discord-player")
const player = require("../../client/discordMusicPlayer")

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: "Plays a song",
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

        if (!songTitle) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - Please provide a song URL or song name!`)
            ] })

        if (!message.member.voice.channel) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - You have to be in a Voice Channel to use this command!`)
                ] })

        const searchResult = await player.search(songTitle, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO,
        })

        const queue = await player.createQueue(message.guild, { metadata: message.channel })

        if (!queue.connection) await queue.connect(message.member.voice.channel)

        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) 
            return message.reply({ embeds: [
                new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`‼️ - Music is currently being played in **${message.guild.me.voice.channel.name}**. You've to be in the same Voice Channel to execute this command!`)
            ] })

        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0])

        if (!queue.playing) await queue.play()

        message.reply({ embeds: [
            new MessageEmbed()
            .setColor("#3d35cc")
            .setDescription(`🎵 - Song added **${searchResult.tracks[0]}** - requested by **${message.author.tag}** - into **${message.member.voice.channel.name}**`)
        ] })

    }
}