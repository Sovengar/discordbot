const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const player = require("../../../client/discordMusicPlayer");

module.exports = {
    name: "seek",
    description: "Seek to the given time",
    type: 'CHAT_INPUT',
    permissions: "",
    cooldown: 5,
    options: [
        { name: 'time', description: 'The time to seek to (in seconds)', type: "INTEGER", required: true,}
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        await interaction.deferReply()
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

        const time = interaction.options.getInteger('time') * 1000;
        await queue.seek(time);

        return interaction.followUp({ embeds: [
            new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`✅ - Seeked to **${time / 1000} seconds **`)
        ] })
    },
};