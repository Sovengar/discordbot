const player = require("../../../client/discordMusicPlayer")
const { Client, CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'loop',
    description: "Loops the track or queue",
    type: 'CHAT_INPUT',
    cooldown: 5,
    options: [
        { 
            name: "mode", 
            description: "Choose a loop mode among 'off', 'track', 'queue', 'autoplay'", 
            type: "STRING", 
            required: true,
            choices: [
                { name: 'Off', value: 'off' },
                { name: 'Track', value: 'track' },
                { name: 'Queue', value: 'queue' },
                { name: 'Autoplay', value: 'autoplay' }
            ]
        }  
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        await interaction.deferReply()
        const mode = interaction.options.getString('mode')
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

        if (mode === "off") {
            queue.setRepeatMode(0)
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`✅ - Loop mode is now disabled`)
            ] })
        } 
        
        else if (mode === "track") {
            queue.setRepeatMode(1)
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`✅ - Loop mode is now set to **TRACK**`)
            ] })
        } 
        
        else if (mode === "queue") {
            queue.setRepeatMode(2)
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`✅ - Loop mode is now set to **QUEUE**`)
            ] })
        } 
        
        else if (mode === "autoplay") {
            queue.setRepeatMode(3)
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`✅ - Loop mode is now set to **AUTOPLAY**`)
            ] })
        }
    }
}