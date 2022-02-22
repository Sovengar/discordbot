const player = require("../../client/discordMusicPlayer")
const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'move',
    aliases: ["move"],
    description: "Moves the track provided to the top or if specified, other position",
    usage: '<track position> [new position]',
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
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

        if(!args[0]) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - Provide the number of the track you want to remove!, check queue to know the number`)
            ] })

        if(isNaN(args[0])) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - You didnt provide a number, provide the number of the track you want to remove!, check queue to know the number`)
            ] })

        const trackIndex = args[0] - 1

        if(!queue.tracks[trackIndex]?.title)
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - You didnt provide a valid number, check queue to know the number`)
            ] })

        const trackName = queue.tracks[trackIndex].title;
        const trackUrl = queue.tracks[trackIndex].url;
        const track = queue.remove(trackIndex);
        let newPosition

        if(!args[1]) newPosition = 0
        else {
            if(isNaN(args[1])) 
                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription(`‼️ - You didnt provide a number, provide the number to set the new position of the song in the queue!`)
                ] })

            newPosition = args[1] - 1
        }

        queue.insert(track, newPosition);

        return message.reply({ embeds: [
            new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`✅ - Moved **[${trackName}](${trackUrl})** to position **${newPosition + 1}**`)
        ] })
    }
}