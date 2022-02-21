const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const player = require("../../../client/discordMusicPlayer");

module.exports = {
    name: "jump",
    description: "Jump to a specific track",
    type: 'CHAT_INPUT',
    permissions: "",
    cooldown: 5,
    options: [
        { name: "track", description: "The number of the track to jump", type: "INTEGER", required: true, },
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

        const trackIndex = interaction.options.getInteger('track') - 1

        if(!queue.tracks[trackIndex]?.title)
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - You didnt provide a valid number, check queue to know the number`)
            ] })

        const trackName = queue.tracks[trackIndex].title;
        queue.jump(trackIndex);

        return interaction.followUp({ embeds: [
            new MessageEmbed()
                .setColor("#3d35cc")
                .setDescription(`⏭ | Song **${trackName}** has jumped the queue!`)
        ] })
    },
};
