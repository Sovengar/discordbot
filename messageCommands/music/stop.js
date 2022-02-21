const { Client, Message, MessageEmbed } = require('discord.js')
const player = require("../../client/discordMusicPlayer")

module.exports = {
    name: 'stop',
    aliases: ["disconnect"],
    description: "Stops a song & disconnects",
    usage: '',
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

        queue.stop()

        return message.reply({ embeds: [
            new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`✅ - Music stopped into this server`)
        ] })
    }
}