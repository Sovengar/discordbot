const player = require("../../../client/discordMusicPlayer");
const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    name: "resume",
    description: "resume the current song",
    type: 'CHAT_INPUT',
    permissions: "",
    cooldown: 5,
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

        queue.setPaused(false)

        return interaction.followUp({ embeds: [
            new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`✅ - Song **${queue.current.title}** has been resumed`)
        ] })
    },
};
