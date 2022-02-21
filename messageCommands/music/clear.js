const player = require("../../client/discordMusicPlayer");
const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: "clear",
    aliases: ['clear'],
    description: "Clear the queue",
    usage: '',
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const queue = player.getQueue(message.guildId);

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

        queue.clear()

        return message.reply({ embeds: [
            new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`✅ - Queue cleared!!`)
        ] })
    },
};