const player = require("../../client/discordMusicPlayer")
const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'queue',
    aliases: ["q"],
    description: "Displays all the songs in queue",
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

        const currentTrack = queue.current

        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `\`${i + 1}.\` - [**${m.title}**](${m.url}) - \`${m.requestedBy.tag}\``
        })
        
        if(!tracks.length){
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#3d35cc")
                    .setTitle(`**🎶 Song queue - ${message.guild.name} 🎶**`)
                    .addFields([
                        { name: "Current:", value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - \`${currentTrack.requestedBy.tag}\`\n\n` 
                        },
                    ])
                    .setThumbnail(currentTrack.thumbnail)
                    .setTimestamp()
                ] })
        } else{
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#3d35cc")
                    .setTitle(`**🎶 Song queue - ${message.guild.name} 🎶**`)
                    .addFields([
                        { name: "Current:", value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - \`${currentTrack.requestedBy.tag}\`\n\n` },
                        {
                            name: "Queue:", value: `${tracks.join("\n")}${queue.tracks.length > tracks.length ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}` : ""}`
                        }
                    ])
                    .setThumbnail(currentTrack.thumbnail)
                    .setTimestamp()
                ] })
        }  
    }
}