const player = require("../../client/discordMusicPlayer")
const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'loop',
    aliases: ["l"],
    description: "Loops the track or queue",
    usage: '<mode>',
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const mode = args[0]
        const modes = ["off", "track", "queue", "autoplay"]
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

        if (!modes.includes(mode)) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - You can only choose among, \`off\`, \`track\`, \`queue\` & \`autoplay\``)
            ] })

        if (mode === "off") {
            queue.setRepeatMode(0)
            return message.reply({ embeds: [
                new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`✅ - Loop mode is now disabled`)
            ] })
        } 
        
        else if (mode === "track") {
            queue.setRepeatMode(1)
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`✅ - Loop mode is now set to **TRACK**`)
            ] })
        } 
        
        else if (mode === "queue") {
            queue.setRepeatMode(2)
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`✅ - Loop mode is now set to **QUEUE**`)
            ] })
        } 
        
        else if (mode === "autoplay") {
            queue.setRepeatMode(3)
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`✅ - Loop mode is now set to **AUTOPLAY**`)
            ] })
        }
    }
}